import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { getMatches } from '../helpers/searchHelper';
import { betWithSpotlight, handleQuickBet, handleMultipleBets, removeComboBet } from '../helpers/bettingHelper';
import { Logger } from '../utils/logger';
import { timeout } from '../playwright.config'; 
import 'fs';

test.describe('Epicbet search functionality tests', () => {
    let mainPage;
    let logger;

    test.beforeAll(() => {
        logger = new Logger('info');
    });

    test.beforeEach(async ({ page }) => {
        const context = page.context(); // Use the existing page's context

        await Mainpage.loadCookies(context);
        const cookiesValid = await Mainpage.areCookiesValid(context);

        mainPage = new Mainpage(page, logger); // Use the provided page
        if (!cookiesValid) {
            logger.info('Cookies expired or missing. Proceeding without cookies.');
            await mainPage.navigateTo('https://epicbet.com/en/', false);
            await mainPage.saveCookies();
        } else {
            logger.info('Cookies loaded and valid. Skipping cookie banner.');
            await mainPage.navigateTo('https://epicbet.com/en/', null);
        }
    });

    test('Spotlight bet testing', async ({ page }, testInfo) => {
        testInfo.setTimeout(60000)
        logger?.info('Starting spotlight bet test...');

        await betWithSpotlight(page, logger);
        await handleQuickBet(page, logger, '10');

        logger?.info('Waiting for authentication modal display');
        const authModal = page.getByTestId('auth-modal');
        await expect(authModal).toBeVisible();

        logger?.info('Closing authentication modal display');
        const closeModalButton = page.getByTestId('close-modal');
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click();

        logger?.info('Waiting for authentication modal to disappear');
        await expect(authModal).not.toBeVisible();

        logger?.info('Searching for bet slip floater...');
        const betSlip = page.getByTestId('betslip-floater');
        await expect(betSlip).toBeVisible();

        logger?.info('Spotlight bet tested.');
    });

    test('Make combobet', async ({ page }, testInfo) => {
        testInfo.setTimeout(120000);
        logger?.info('Starting combobet test...');

        const dynamicSearchTerms = await getMatches(page, 5, logger);
        logger?.info(`Extracted search terms: ${dynamicSearchTerms}`);

        const searchTermsForBets = dynamicSearchTerms.filter((_, index) => index % 2 === 0);
        logger?.info(`Search terms for bets: ${searchTermsForBets}`);

        for (const term of searchTermsForBets) {
            await handleMultipleBets(page, logger, term);
        }

        await removeComboBet(page, logger, searchTermsForBets)

        logger?.info('Combobet tested.');
    });

});