import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { waitForMatchContainers, getMatches, getLeagues, testSearchTerm } from '../helpers/searchHelper';
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
        await mainPage.refuseCookies();
        await mainPage.waitForMatchContainers();
        await page.waitForLoadState('domcontentloaded');
    });


    test('Fetch and validate matches', async ({ page }) => {
        const dynamicSearchTerms = await getMatches(page, 5, logger);
        for (const term of dynamicSearchTerms) {
            await mainPage.openSearchModal()
            await testSearchTerm(page, term, logger);
            await mainPage.closeSearchModal();
        }
    });


    // Although league names are on the front page, some leagues and cups do not appear in the search such as NBA, Ligue 1, La Liga. 
    // This is probably a bug. I made a fetcher (getLeagues()) that gets the league names on the front page and passes them as search parameters and it didn't work.
    // The test passes with the following leagues: Euroleague and Premier League, but I don't want to accomodate test just to pass them on certain terms.

    test('Fetch and validate leagues', async ({ page }) => {
        const leagueNames = await getLeagues(page, 5, logger)
        // const searchTerms = ['Euroleague', 'Premier League'];
        for (const term of leagueNames) {
            await mainPage.openSearchModal()
            await testSearchTerm(page, term, logger);
            await mainPage.closeSearchModal();
        }
    });

    test('Search for wrong terms', async ({ page }) => {
        const wrongTerms = ['\bAr(?:[a-zA-Z]{2,10}|[0-9]+(?:[a-zA-Z]+)?)\b', 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', 'FC Zapoos', 'Javascript']
        for (const term of wrongTerms) {
            await mainPage.openSearchModal()
            await testSearchTerm(page, term, logger, false);
            await mainPage.closeSearchModal();
        }
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });
});
