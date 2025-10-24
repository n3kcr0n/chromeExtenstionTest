import { Page } from "@playwright/test";
import LoginPage from "./extensionTestLoginPage";

/**
 * Manages the pages for the application
 */
export default class PageManager {
    constructor(private readonly page: Page) { }

    /**
     * 
     * @returns new instance of the login page
     */
    loginPage() {
        return new LoginPage(this.page)
    }
}