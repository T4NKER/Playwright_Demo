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
