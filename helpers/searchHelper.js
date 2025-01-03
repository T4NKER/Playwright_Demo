import { expect } from '@playwright/test';

export async function waitForMatchContainers(page, logger = null) {
    logger?.info('Waiting for match containers...');
    const matchLocator = page.locator('[data-testid="match-container"]');
    await matchLocator.first().waitFor({ state: 'visible', timeout: 60000 });
    logger?.info('Match containers are visible.');
}

export async function fetchSearchTerms(page, limit = 5, logger = null) {
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

export async function performSearches(page, searchTerms, logger = null) {
    let modalOpen = false;

    for (const term of searchTerms) {
        logger?.info(`Performing search for term: ${term}`);

        if (!modalOpen) {
            modalOpen = true;
            const searchButton = page.locator('[data-testid="search-button"]');
            await searchButton.click();
        }

        const searchContainer = page.locator('[data-testid="search-container"]');
        await expect(searchContainer).toBeVisible();

        const searchInput = page.locator('[data-testid="search-input"]');
        await searchInput.fill(term);

        await page.waitForTimeout(1000);

        const matchContainers = searchContainer.locator('[data-testid="match-container"]');
        const matchCount = await matchContainers.count();
        expect(matchCount).toBeGreaterThan(0);

        const firstMatchContainer = matchContainers.first();
        await expect(firstMatchContainer).toBeVisible();

        const firstMatchText = await firstMatchContainer.textContent();
        logger?.info(`First match for "${term}": ${firstMatchText}`);
        expect(firstMatchText).toContain(term);

        for (let i = 1; i < matchCount; i++) {
            const matchContainer = matchContainers.nth(i);
            await expect(matchContainer).toBeVisible();
        }
    }
}
