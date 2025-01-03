import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { waitForMatchContainers, fetchSearchTerms, performSearches } from '../helpers/searchHelper';
import { Logger } from '../utils/logger';

test.describe('Epicbet search functionality tests', () => {
    let mainPage;
    let logger;

    test.beforeAll(() => {
        logger = new Logger('debug');
    });

    test.beforeEach(async ({ page }) => {
        mainPage = new Mainpage(page, logger);

        await mainPage.navigateTo('https://epicbet.com');
        await mainPage.waitForMatchContainers();
    });

    test('should dynamically fetch search terms and validate results', async ({ page }) => {
        const searchTerms = await fetchSearchTerms(page, 5, logger);

        await performSearches(page, searchTerms, logger);
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});