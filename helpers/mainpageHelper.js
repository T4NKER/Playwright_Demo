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
        const searchButton = this.page.getByTestId('search-button');
        await expect(searchButton).toBeVisible(); 
        await searchButton.click();
        const modal = this.page.getByTestId('search-container');
        await expect(modal).toBeVisible(); 
        this.log('Search modal opened.');
    }

    async refuseCookies() {
        this.log('Refusing cookies...');
        const refuseCookieButton = this.page.locator('#CybotCookiebotDialogBodyButtonDecline');
        await refuseCookieButton.waitFor({ state: 'visible' }); // Wait until the button is visible
        await refuseCookieButton.click(); // Click the button
        this.log('Cookies refused.');
    }

    async closeSearchModal() {
        this.log('Closing search modal...');
        const closeButton = this.page.getByTestId('close-modal');
        await expect(closeButton).toBeVisible(); // Ensure button is visible
        await closeButton.click();
        const modal = this.page.getByTestId('search-container');
        await modal.waitFor({ state: 'hidden', timeout: 10000 }); // Ensure modal is closed
        this.log('Search modal closed.');
    }

    async closeSearchModal() {
        this.log('Closing search modal...');
        const closeButton = this.page.getByTestId('close-modal');
        await closeButton.click();
    }

    async fillSearchInput(term) {
        this.log(`Filling search input with term: ${term}`);
        const searchInput = this.page.getByTestId('search-input');
        await searchInput.fill(term);
    }

    async getMatchContainer(index = 0) {
        this.log(`Getting match container at index ${index}`);
        return this.page.getByTestId('match-container').nth(index);
    }

    async waitForMatchContainers() {
        this.log('Waiting for match containers...');
        const matchLocator = this.page.getByTestId('match-container');
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
        await this.refuseCookies();
        await this.waitForMatchContainers();
    }
}
