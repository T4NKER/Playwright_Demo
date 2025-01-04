import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { interactWithSpotlight, handleQuickBet } from '../helpers/bettingHelper';
import { Logger } from '../utils/logger';
import { timeout } from '../playwright.config';

test.describe('Epicbet search functionality tests', () => {
    let mainPage;
    let logger;

    test.beforeAll(() => {
        logger = new Logger('debug');
    });

    test.beforeEach(async ({ page }) => {
        mainPage = new Mainpage(page, logger);
        await mainPage.navigateTo('https://epicbet.com/en/');
        await mainPage.refuseCookies();
        await mainPage.waitForMatchContainers();
        await page.waitForLoadState('domcontentloaded');
    });

    test.only('Spotlight bet testing', async ({ page }) => {
        logger?.info('Spotlight bet testing...');

        await interactWithSpotlight(page, logger);
        await handleQuickBet(page, logger);

        logger?.debug('Waiting for authentication modal display');
        const authModal = page.getByTestId('auth-modal');
        await expect(authModal).toBeVisible();

        logger?.debug('Closing authentication modal display');
        const closeModalButton = page.getByTestId('close-modal');
        await expect(closeModalButton).toBeVisible();
        await closeModalButton.click();

        logger?.debug('Waiting for authentication modal to disappear');
        await expect(authModal).not.toBeVisible();

        logger?.debug('Searching for bet slip floater...');
        const betSlip = page.getByTestId('betslip-floater');
        await expect(betSlip).toBeVisible();

        logger?.info('Spotlight bet tested.');
    });

});