import { test, expect } from '@playwright/test';
import { Mainpage } from '../helpers/mainpageHelper';
import { waitForMatchContainers, getMatches, getLeagues, testSearchTerm } from '../helpers/searchHelper';
import { Logger } from '../utils/logger';

test.describe('Epicbet search functionality tests', () => {
    let mainPage;
    let logger;

    test.beforeAll(() => {
        logger = new Logger('info');
    });
    test.beforeEach(async ({ page }) => {
        mainPage = new Mainpage(page, logger);
        await mainPage.navigateTo('https://epicbet.com/en/');
        await page.waitForLoadState('domcontentloaded');
    });

    test('Validate search functionality with dynamic match terms', async ({ page }, testInfo) => {
        testInfo.setTimeout(120000);

        logger.info('Starting match validation');

        const dynamicSearchTerms = await getMatches(page, 5, logger);

        await mainPage.openSearchModal();

        for (const term of dynamicSearchTerms) {
            await testSearchTerm(page, term, logger);
        }
        logger.info('Match validation completed.');
    });

    test.fail('Validate search functionality with dynamic league terms', async ({ page }, testInfo) => {
        test.info().annotations.push({ bug: 'There is a bug where it doesnt find leagues that it gets from the front page by search. I dont think its my issue.' });
        testInfo.setTimeout(60000);
        logger.info('Starting league validation');

        const leagueNames = await getLeagues(page, 5, logger);

        if (!leagueNames || leagueNames.length === 0) {
            logger.error('No leagues found to validate.');
            throw new Error('Leagues list is empty. Validation skipped.');
        }

        await mainPage.openSearchModal();

        for (const term of leagueNames) {
            await testSearchTerm(page, term, logger);
        }
        logger.info('League validation completed.');
    });

    test.describe('Validate search functionality with wrong searches', () => {
        
        const wrongTerms = [
            { term: '\bAr(?:[a-zA-Z]{2,10}|[0-9]+(?:[a-zA-Z]+)?)\b', description: 'Regex-like pattern' },
            { term: 'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww', description: 'Excessively long string' },
            { term: 'Javascript', description: 'Programming language name' },
            { term: 'DROP TABLE USERS', description: 'SQL injection attempt' },
            { term: '!@#$%^&*', description: 'Special characters' },
        ];

        for (const { term, description } of wrongTerms) {
            
            test(`Search term: "${term}"`, async ({ page }, testInfo) => {
                logger.info('Starting search for wrong terms');
                testInfo.setTimeout(60000);
                await mainPage.openSearchModal();
                await testSearchTerm(page, term, logger, false);
                logger.info('Ended search for wrong terms');
            });
            
        }
        
    });

});
