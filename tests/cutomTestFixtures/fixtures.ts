import { test as base, chromium, BrowserContext, Page } from '@playwright/test';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { config } from '../../config/testConfig';

/** Playwright fixture extension setup.
 * context: This fixture will provide a Playwright BrowserContext — a fully isolated browser environment.
 * extensionId: This Fixture will hold the unique Chrome extension ID that Chrome assigns when your extension loads.
 * loginPage: This fixture creates and provides a Page (browser tab) that loads your extension’s login page.
 */
export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
    loginPage: Page;
}>({

    //Creating browser context
    context: async ({ }, use) => {

        /** Chrome preparations
         * Create the absolute path to your Chrome extension.
         * Generate a temporary user profile folder for Chrome.
         * Make sure that folder actually exists before launching the browser.
         */
        const EXTENSION_PATH = path.join(__dirname, config.processEnv.extension);
        const USER_DATA_DIR = path.join(os.tmpdir(), `test-user-data-dir-${Date.now()}`);
        await fs.ensureDir(USER_DATA_DIR);

        /**
         * launchPersistentContext() is used because Chrome only allows extensions in persistent contexts
         * Starts a new browser context tied to a real user data directory.
         * Keeps your session data, cookies, and installed extensions in that folder.
         */
        const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
            headless: false,
            args: [
                `--disable-extensions-except=${EXTENSION_PATH}`,
                `--load-extension=${EXTENSION_PATH}`,
            ],
        });

        /**
         * Returns a list of all service workers currently running in that browser context.
         * Ensures the extension is fully initialized before running any test logic.
         * The use() callback exposes the context to your tests.
         * Cleans up everything afterward — closing the browser and deleting temporary user data — even if a test fails or throws an error.
         */
        try {
            let [serviceWorker] = context.serviceWorkers();
            if (!serviceWorker)
                serviceWorker = await context.waitForEvent('serviceworker');
            await use(context);
        } finally {
            // Always close and clean up even if test fails
            await context.close().catch(() => { });
            await fs.remove(USER_DATA_DIR).catch(() => { });
        }
    },

    /**
     * Give Chrome a short moment to initialize the extension for 2 sec
     * Load the service worker
     * Checking if service worker is existing 
     * Getting the extensionID
     * Use the extension Id coming from service worker
     */
    extensionId: async ({ context }, use) => {

        await new Promise((r) => setTimeout(r, 2000));
        const serviceWorker = context.serviceWorkers()[0];
        if (!serviceWorker) throw new Error('❌ Could not find extension background or service worker');
        const extensionId = new URL(serviceWorker.url()).host;
        console.log('✅ Extension ID:', extensionId);
        await use(extensionId);
    },

    /**
     * This creates a new tab (Page) within that browser context.
     * This line navigates that page to the login page of the Chrome extension.
     * In Chrome extensions, pages are loaded from a chrome-extension:// URL using the extension’s unique ID.
     * Simulates the size of the extension popup (400×520 pixels).
     * Use() is how you expose the fixture’s value (in this case, the page) to the test.
     */
    loginPage: async ({ context, extensionId }, use) => {
        const page = await context.newPage();
        await page.goto(`chrome-extension://${extensionId}/login.html`);
        await page.setViewportSize({ width: 400, height: 520 });
        await use(page);
    },
});
