import { expect } from '@playwright/test';

export async function waitForMatchContainers(page, logger = null) {
    logger?.info('Waiting for match containers...');
    const matchLocator = page.getByTestId('match-container');
    await matchLocator.first().waitFor({ state: 'visible', timeout: 60000 });
    logger?.info('Match containers are visible.');
}

export async function getMatches(page, limit = 5, logger = null) {
    try {
        logger?.info(`Fetching up to ${limit} search terms...`);
        const homepageMatchContainers = page.getByTestId('match-container');
        const homepageMatchCount = await homepageMatchContainers.count();

        if (homepageMatchCount < limit) {
            logger?.warn(`Only ${homepageMatchCount} match containers found, expected at least ${limit}.`);
        }

        const searchTerms = [];
        for (let i = 0; i < Math.min(limit, homepageMatchCount); i++) {
            const matchContainer = homepageMatchContainers.nth(i);
            const matchText = await matchContainer.textContent();

            if (matchText) {
                const beforeTime = matchText.split(/\d{1,2}:\d{2}/)[0]; 
                logger?.debug(`Extracted part before time: ${beforeTime}`);

                const teamRegex = /[A-Z]{2,}(?=[A-Z][a-z])|[A-Z][a-z]+(?:\s[A-Z][a-z]+)?/g;
                const teams = beforeTime.match(teamRegex) || [];

                if (teams.length >= 2) {
                    const team1 = teams[0].trim();
                    const team2 = teams[1].trim();
                    logger?.debug(`Extracted teams: ${team1}, ${team2}`);
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

        const searchContainer = page.getByTestId('search-container');
        await expect(searchContainer).toBeVisible();

        const searchInput = page.getByTestId('search-input');
        await searchInput.fill(term);

        // Wait dynamically for a match container with the term in its textContent
        const matchContainers = searchContainer.getByTestId('match-container');
        if (expectMatches) {
            logger?.debug(`Waiting for a match container with the term "${term}"...`);

            const matchingContainer = matchContainers.filter({
                hasText: term, 
            });

            await expect(matchingContainer.first()).toBeVisible({
                timeout: 10000, 
            });

            const matchCount = await matchContainers.count();
            logger?.debug(`Match count for "${term}": ${matchCount}`);
            expect(matchCount).toBeGreaterThan(0);

            const firstMatchText = await matchingContainer.first().textContent();
            logger?.info(`First match for "${term}": ${firstMatchText}`);
            expect(firstMatchText).toContain(term);
        } else {
            logger?.debug(`Checking that no matches are found for term "${term}"...`);
            const matchCount = await matchContainers.count();
            expect(matchCount).toBe(0);
            logger?.info(`No matches found for term "${term}", as expected.`);
        }

        // Clear the search input
        await searchInput.fill('');
    } catch (error) {
        logger?.error(`Error during search for term "${term}": ${error.message}`);
        throw error;
    }
}




