import { logInfo } from '../utils/logger';

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

    async navigateTo(url) {
        this.log(`Navigating to ${url}`);
        await this.page.goto(url);
    }

    async openSearchModal() {
        this.log('Opening search modal...');
        const searchButton = this.page.locator('[data-testid="search-button"]');
        await searchButton.click();
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
}
