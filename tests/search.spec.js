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
        await page.waitForLoadState('domcontentloaded');
    });

    test('Fetch and validate matches', async ({ page }, testInfo) => {
        testInfo.setTimeout(120000);
        const dynamicSearchTerms = await getMatches(page, 5, logger);
        for (const term of dynamicSearchTerms) {
            await mainPage.openSearchModal();
            await testSearchTerm(page, term, logger);
            await mainPage.closeSearchModal();
        }
    });

    test.fail('Fetch and validate leagues', async ({ page }, testInfo) => {
        test.info().annotations.push({bug: 'There is a bug where it doesnt find leagues that it gets from the front page by search.' });
        testInfo.setTimeout(60000);
        const leagueNames = await getLeagues(page, 5, logger);
        for (const term of leagueNames) {
            await mainPage.openSearchModal();
            await testSearchTerm(page, term, logger);
            await mainPage.closeSearchModal();
        }
    });

    test.describe('Search for wrong terms', () => {

        const wrongTerms = [
            { term: '\bAr(?:[a-zA-Z]{2,10}|[0-9]+(?:[a-zA-Z]+)?)\b', description: 'Regex-like pattern' },
            { term: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', description: 'Excessively long string' },
            { term: 'Javascript', description: 'Programming language name' },
            { term: 'DROP TABLE USERS', description: 'SQL injection attempt' },
            { term: '!@#$%^&*', description: 'Special characters' },
        ];

        for (const { term, description } of wrongTerms) {
            test(`Search term: "${term}"`, async ({ page }, testInfo) => {
                testInfo.setTimeout(60000);
                await mainPage.openSearchModal();
                await testSearchTerm(page, term, logger, false);
            });
        }
    });

});
