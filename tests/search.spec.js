import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { waitForMatchContainers, fetchSearchTerms, testSearchTerm } from '../helpers/searchHelper';
import { Logger } from '../utils/logger';

test.describe('Epicbet search functionality tests', () => {
    let mainPage;
    let logger;

    test.beforeAll(() => {
        logger = new Logger('debug');
    });

    test.beforeEach(async ({ page }) => {
        mainPage = new Mainpage(page, logger);

        await mainPage.navigateTo('https://epicbet.com/en/');
        await mainPage.waitForMatchContainers();
        
    });

    test.describe('Dynamic search terms validation', () => {
        test('Fetch and validate search terms dynamically', async ({ page }) => {
            const dynamicSearchTerms = await fetchSearchTerms(page, 5, logger); 
            for (const term of dynamicSearchTerms) {
                await mainPage.openSearchModal()
                await testSearchTerm(page, term, logger);
                await mainPage.closeSearchModal();
            }
        });
    });

    test('Search for world leagues', async ({ page }) => {
        const searchTerms = ['Euroleague', 'Premier League', 'La Liga', 'Ligue 1', 'NBA'];
        for (const term of searchTerms) {
            await mainPage.openSearchModal()
            await testSearchTerm(page, term, logger); 
            await mainPage.closeSearchModal();
        }
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});
