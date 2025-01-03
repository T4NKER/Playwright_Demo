import { logInfo } from '../utils/logger';
import { expect } from '@playwright/test';

export class Mainpage {
    constructor(page, logger = null) {
        this.page = page;
        this.logger = logger || { info: () => { } }; 
    }

    log(message) {
        if (this.logger && this.logger.info) {
            this.logger.info(message);
        }
    }

    async openSearchModal() {
        this.log('Opening search modal...');
        const searchButton = this.page.locator('[data-testid="search-button"]');
        await expect(searchButton).toBeVisible(); // Ensure button is visible
        await searchButton.click();
        const modal = this.page.locator('[data-testid="search-container"]');
        await expect(modal).toBeVisible(); // Ensure modal is fully opened
        this.log('Search modal opened.');
    }

    async closeSearchModal() {
        this.log('Closing search modal...');
        const closeButton = this.page.locator('[data-testid="close-modal"]');
        await expect(closeButton).toBeVisible(); // Ensure button is visible
        await closeButton.click();
        const modal = this.page.locator('[data-testid="search-container"]');
        await modal.waitFor({ state: 'hidden', timeout: 5000 }); // Ensure modal is closed
        this.log('Search modal closed.');
    }

    async closeSearchModal() {
        this.log('Closing search modal...');
        const closeButton = this.page.locator('[data-testid="close-modal"]');
        await closeButton.click();
    }

    async fillSearchInput(term) {
        this.log(`Filling search input with term: ${term}`);
        const searchInput = this.page.locator('[data-testid="search-input"]');
        await searchInput.fill(term);
    }

    async getMatchContainer(index = 0) {
        this.log(`Getting match container at index ${index}`);
        return this.page.locator('[data-testid="match-container"]').nth(index);
    }

    async waitForMatchContainers() {
        this.log('Waiting for match containers...');
        const matchLocator = this.page.locator('[data-testid="match-container"]');
        await matchLocator.first().waitFor({ state: 'visible', timeout: 60000 });
        this.log('Match containers are visible.');
    }

    async validateMatchContainerVisible(index = 0) {
        const matchContainer = await this.getMatchContainer(index);
        await matchContainer.waitFor({ state: 'visible' });
        this.log(`Match container at index ${index} is visible.`);
    }

    async extractMatchText(index = 0) {
        const matchContainer = await this.getMatchContainer(index);
        const matchText = await matchContainer.textContent();
        this.log(`Extracted match text at index ${index}: ${matchText}`);
        return matchText;
    }

    async navigateTo(page) {
        this.log(`Navigating to ${page}`);
        await this.page.goto(page);
    }
}
