import { logInfo } from '../utils/logger';
import { expect } from '@playwright/test';

export class Mainpage {
    constructor(page, logger = null) {
        this.page = page;
        this.logger = logger || new Logger('info');
    }

    log(message) {
        this.logger.info(message);
    }

    logDebug(message) {
        this.logger.debug(message);
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
        await refuseCookieButton.waitFor({ state: 'visible' }); 
        await refuseCookieButton.click(); 
        this.log('Cookies refused.');
    }

    async closeSearchModal() {
        this.log('Closing search modal...');
        const closeButton = this.page.getByTestId('close-modal');
        await expect(closeButton).toBeVisible(); 
        await closeButton.click();
        const modal = this.page.getByTestId('search-container');
        await modal.waitFor({ state: 'hidden', timeout: 10000 }); 
        this.log('Search modal closed.');
    }

    async waitForMatchContainers() {
        this.log('Waiting for match containers...');
        const matchLocator = this.page.getByTestId('match-container');
        await matchLocator.first().waitFor({ state: 'visible', timeout: 60000 });
        this.log('Match containers are visible.');
    }

    async navigateTo(pageUrl) {
        try {
            this.log(`Navigating to ${pageUrl}`);
            await this.page.goto(pageUrl);
            await this.refuseCookies();
            await this.waitForMatchContainers();
        } catch (error) {
            this.log(`Error navigating to ${pageUrl}: ${error.message}`);
            throw error;
        }
    }
}
