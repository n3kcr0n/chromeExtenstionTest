import { Locator, Page } from "@playwright/test";
import CredentialSecurity from "../config/utils/credSecurity";

export default class LoginPage {
    readonly header: Locator;
    readonly logo: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly themeBtn: Locator;
    readonly loginBtn: Locator;
    readonly message: Locator;
    readonly contactSupportLink: Locator;
    readonly body: Locator;

    constructor(private readonly page: Page) {
        this.header = this.page.locator('h1')
        this.logo = this.page.locator("img[class='logo']")
        this.username = this.page.locator('#username')
        this.password = this.page.locator('#password')
        this.themeBtn = this.page.locator('#theme-btn')
        this.loginBtn = this.page.locator('button[type="submit"]')
        this.message = this.page.locator('#message')
        this.contactSupportLink = this.page.getByRole('link', { name: 'Contact support' })
        this.body = this.page.locator('body')
    }

    //Funtions
    /**
     * Login function for user that is encrypted password
     * @param username username credentials
     * @param password username password in encrypted form
     */
    async encryptedLogin(username: string, password: string) {
        await this.username.fill(username)
        await this.password.fill(new CredentialSecurity().decrypt(password))
        await this.loginBtn.click()
    }

    /**
     * Login function for normal credentials
     * @param username username credentials
     * @param password username password in non encrypted form
     */
    async normalLogin(username: string, password: string) {
        await this.username.fill(username)
        await this.password.fill(password)
        await this.loginBtn.click()
    }
}