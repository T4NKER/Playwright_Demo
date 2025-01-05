import { expect } from '@playwright/test'

export async function interactWithSpotlight(page, logger) {
    logger?.debug('Searching for spotlight...');

    const spotlight = page.getByTestId('spotlight-container');
    await expect(spotlight).toBeVisible();
    await spotlight.scrollIntoViewIfNeeded();

    logger?.debug('Searching for bet button...');
    const betButton = spotlight.getByTestId('outcome-button').first();
    await betButton.hover();
    await expect(betButton).toBeVisible();
    await expect(betButton).toBeEnabled();
    await betButton.click();

    logger?.debug('Bet button clicked');
}

export async function handleQuickBet(page, logger) {
    logger?.debug('Searching for bet container...');
    const quickbet = page.getByTestId('quickbet-container');
    await expect(quickbet).toBeVisible();

    logger?.debug('Searching for bet amount input...');
    const betAmountInput = quickbet.getByTestId('stake-input');
    await expect(betAmountInput).toBeVisible();
    await betAmountInput.fill('10');

    logger?.debug('Bet amount input filled');
    const betButtonInQuickbet = quickbet.getByTestId('place-bet-button');
    await expect(betButtonInQuickbet).toBeVisible();
    await betButtonInQuickbet.click();
}

export async function handleMultipleBets(page, logger, term) {
    try {
        logger?.info(`Handling bet for term: ${term}`);

        const matchContainer = page.getByTestId('match-container').filter({ hasText: term });
        await expect(matchContainer).toBeVisible();
        await matchContainer.scrollIntoViewIfNeeded();
        logger?.debug(`Found match container for term: ${term}`);

        const outcomeButton = matchContainer.getByTestId('outcome-button').first();
        await expect(outcomeButton).toBeVisible();
        await expect(outcomeButton).toBeEnabled();
        await outcomeButton.click();
        logger?.info(`Selected outcome for term: ${term}`);
    } catch (error) {
        logger?.error(`Error handling bet for term "${term}": ${error.message}`);
        throw error;
    }
}

export async function removeComboBet(page, logger, terms) {
    logger?.debug('Searching for bet slip floater...');
    const betSlip = page.getByTestId('betslip-floater');
    await expect(betSlip).toBeVisible();
    await betSlip.click();

    const betSlipContainer = page.getByTestId('betslip-container');
    await expect(betSlipContainer).toBeVisible();
    logger?.debug('Bet slip floater opened');

    for (const term of terms) {
        const betSlipSelection = betSlipContainer.getByTestId('betslip-selection').filter({ hasText: term })
        await expect(betSlipSelection).toBeVisible();
        const betSlipRemoveButton = betSlipSelection.getByTestId('betslip-remove-selection-button');
        await expect(betSlipRemoveButton).toBeVisible();
        await betSlipRemoveButton.click();
    }

    logger?.info('Bet slip floater closed after removing all bets');
}