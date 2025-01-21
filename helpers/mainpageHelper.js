import { logInfo } from '../utils/logger';
import { expect } from '@playwright/test';
import fs from 'fs/promises';

const COOKIES_PATH = "helpers/cookies/cookies.json";

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

    async acceptCookies() {
        this.log('Accepting cookies...');
        const acceptCookieButton = this.page.locator('#CybotCookiebotDialogBodyButtonAccept');
        await acceptCookieButton.waitFor({ state: 'visible', timeout: 10000 });
        await acceptCookieButton.click();
        this.log('Cookies accepted.');
    }

    async refuseCookies() {
        this.log('Refusing cookies...');
        const refuseCookieButton = this.page.locator('#CybotCookiebotDialogBodyButtonDecline');
        await refuseCookieButton.waitFor({ state: 'visible', timeout: 10000 });
        await refuseCookieButton.click();
        this.log('Cookies refused.');
    }

    async saveCookies() {
        const cookies = await this.page.context().cookies();
        await fs.writeFile(COOKIES_PATH, JSON.stringify(cookies, null, 2)); // Save cookies to file
        this.log('Cookies saved to file.');
    }

    static async loadCookies(context) {
        try {
            const cookies = JSON.parse(await fs.readFile(COOKIES_PATH, 'utf8'));
            await context.addCookies(cookies);
            console.log('Cookies loaded from file.');
        } catch (error) {
            console.log('No cookies file found or cookies invalid. Skipping cookie loading.');
        }
    }

    static async areCookiesValid(context) {
        const cookies = await context.cookies();
        const now = Date.now() / 1000; // Current time in seconds
        return cookies.every(cookie => cookie.expires === -1 || cookie.expires > now);
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

    async navigateTo(pageUrl, acceptCookies = null) {
        try {
            this.log(`Navigating to ${pageUrl}`);
            await this.page.goto(pageUrl);

            if (acceptCookies === true) {
                await this.acceptCookies();
            } else if (acceptCookies === false){
                await this.refuseCookies();
            } else {
                this.log('Cookies have already been inserted')
            }

            await this.waitForMatchContainers();
        } catch (error) {
            this.log(`Error navigating to ${pageUrl}: ${error.message}`);
            throw error;
        }
    }
}
