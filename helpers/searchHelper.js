import { expect } from '@playwright/test';

export async function waitForMatchContainers(page, logger = null) {
    logger?.info('Waiting for match containers...');
    const matchLocator = page.locator('[data-testid="match-container"]');
    await matchLocator.first().waitFor({ state: 'visible', timeout: 60000 });
    logger?.info('Match containers are visible.');
}

export async function getMatches(page, limit = 5, logger = null) {
    try {
        logger?.info(`Fetching up to ${limit} search terms...`);
        const homepageMatchContainers = page.locator('[data-testid="match-container"]');
        const homepageMatchCount = await homepageMatchContainers.count();

        if (homepageMatchCount < limit) {
            logger?.warn(`Only ${homepageMatchCount} match containers found, expected at least ${limit}.`);
        }

        const searchTerms = [];
        for (let i = 0; i < Math.min(limit, homepageMatchCount); i++) {
            const matchContainer = homepageMatchContainers.nth(i);
            const matchText = await matchContainer.textContent();

            if (matchText) {
                const extractedTerms = matchText.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/g) || [];
                if (extractedTerms.length >= 2) {
                    const team1 = extractedTerms[0].trim();
                    const team2 = extractedTerms[1].trim();
                    logger?.debug(`Extracted terms: ${team1}, ${team2}`);
                    searchTerms.push(team1, team2);
                }
            }
        }
        logger?.info(`Extracted search terms: ${searchTerms}`);
        return searchTerms;
    } catch (error) {
        logger?.error(`Error fetching search terms: ${error.message}`);
        throw error;
    }
}

export async function getLeagues(page, limit = 5, logger = null) {
    const leagueElements = page.locator('a[data-router="ignore"]');
    const leagueCount = await leagueElements.count();
    let leagueNames = [];

    for (let i = 0; i < leagueCount; i++) {
        const league = leagueElements.nth(i);
        const leagueName = await league.locator('span:nth-of-type(2)').nth(1).textContent();
        leagueNames.push(leagueName.trim());
    }
    logger?.info(`Extracted League Names: ${leagueNames}`);
    return leagueNames;
}

export async function testSearchTerm(page, term, logger, expectMatches = true) {
    try {
        logger?.info(`Performing search for term: ${term}`);

        const searchContainer = page.locator('[data-testid="search-container"]');
        await expect(searchContainer).toBeVisible();

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.fill(term);

        await page.waitForTimeout(1250);

        const matchContainers = searchContainer.locator('[data-testid="match-container"]');

        const matchCount = await matchContainers.count();
        logger?.info(`Match count for "${term}": ${matchCount}`);

        if (expectMatches) {
            expect(matchCount).toBeGreaterThan(0);

            const firstMatchContainer = matchContainers.first();
            await expect(firstMatchContainer).toBeVisible();

            const firstMatchText = await firstMatchContainer.textContent();
            logger?.info(`First match for "${term}": ${firstMatchText}`);
            expect(firstMatchText).toContain(term);
        } else {
            expect(matchCount).toBe(0); 
            logger?.info(`No matches found for term "${term}", as expected.`);
        }

        await searchInput.fill('');
    } catch (error) {
        logger?.error(`Error during search for term "${term}": ${error.message}`);
        throw error;
    }
}



