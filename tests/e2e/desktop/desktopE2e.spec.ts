import { config } from '../../../config/testConfig';
import PageManager from '../../../page_obj/pageManager';
import { test } from '../../cutomTestFixtures/fixtures';
import { expect } from '@playwright/test';

test.describe('Mobile Test Suite: ', { tag: ['@Regression', '@Desktop', '@Ui'] },
  () => {
    test.beforeEach(async ({ page, extensionId }) => {
      await test.step('Load the extension', async () => {
        await page.goto(`chrome-extension://${extensionId}/login.html`);
        await page.waitForLoadState('domcontentloaded');
      })
    })

    test('P01: Verify if the extension is loading properly on the minimal acceptable time', {
      tag: ['@JIRA TICKET', '@Smoke', '@Performance']
    }, async ({ page, extensionId }) => {
      await test.step('Load the extension', async () => {
        const start = performance.now();
        await page.goto(`chrome-extension://${extensionId}/login.html`);
        await page.waitForLoadState('domcontentloaded');
        const end = performance.now();
        const loadTime = end - start;
        //console.log(`Extension loaded in ${loadTime.toFixed(2)} ms`);
        expect(loadTime).toBeLessThan(2000);
      })
      await expect(page.getByText('TEST EXTENSION')).toBeVisible()
      await expect(page.locator('form#login-form')).toBeVisible();
    });

    test('F01: Validate if the extension logo and header is visible to the end user', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await expect(pm.loginPage().header).toBeVisible()
      await expect(pm.loginPage().logo).toBeVisible()
    })

    test('F02: Validate “Username” and “Password” fields are required ', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await test.step('Click the login button', async () => {
        await pm.loginPage().normalLogin('', '')
        const validationMessage = await page.$eval(
          'input[name="username"]',
          el => (el as HTMLInputElement).validationMessage
        );
        expect(validationMessage).toBe('Please fill out this field.');
      })
    })

    test('F03: Validate “Password” fields are required ', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await test.step('Fill the user name and click the login button', async () => {
        await pm.loginPage().normalLogin('test', '')
        const validationMessage = await page.$eval(
          'input[name="password"]',
          el => (el as HTMLInputElement).validationMessage
        );
        expect(validationMessage).toBe('Please fill out this field.');
      })
    })

    test('F04: Validate that contact support is visible for the user', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await expect(pm.loginPage().contactSupportLink).toBeVisible()
    })

    test('F05: Verify if the valid user can login using good credentials @Smoke', { tag: ['@JIRA TICKET', '@Smoke', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await test.step('User enter his/her credentials and click the login button', async () => {
        await pm.loginPage().encryptedLogin(config.processEnv.username, config.processEnv.password)
      })
      await expect(pm.loginPage().message).toContainText('Login successful!');
    })

    test("F06: Verify if the invalid user can't login using bad credentials", { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await test.step('User enter his/her credentials and click the login button', async () => {
        await pm.loginPage().normalLogin('test', 'test123')
      })
      await expect(pm.loginPage().message).toContainText('Invalid credentials');
    })

    test('F07: Verify password field should mask password input with asterisks or dots', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await test.step('User enter his/her credentials and click the login button', async () => {
        await pm.loginPage().normalLogin('test', 'test123')
      })
      expect(pm.loginPage().password).toHaveValue('test123')
      expect(await pm.loginPage().password.getAttribute('type')).toBe('password');
    })

    test('F08: Verify if the theme button is working properly', { tag: ['@JIRA TICKET', '@Functional'] }, async ({ page }) => {
      const pm = new PageManager(page)
      await expect(pm.loginPage().themeBtn).toBeVisible()
      const toggle = pm.loginPage().themeBtn
      const initialClass = await pm.loginPage().body.getAttribute('class');
      console.log(initialClass)

      if (initialClass?.includes('dark-mode')) {
        await toggle.click();
        await expect(pm.loginPage().body).toHaveClass(/light-mode/);
      } else if (initialClass?.includes('light-mode')) {
        await toggle.click();
        await expect(pm.loginPage().body).toHaveClass(/dark-mode/);
      } else {
        throw new Error('Body does not have either light-mode or dark-mode class.');
      }
    })

    test('S01: Verify if login for is accepting malicious scripts', { tag: ['@JIRA TICKET', '@Security'] }, async ({ page }) => {
      const maliciousScript = '<script>document.getElementById("messageText").innerHTML=document.cookie;document.getElementById("sendMessage").click();</script>'
      const pm = new PageManager(page)
      await test.step('User enter his/her credentials and click the login button', async () => {
        await pm.loginPage().normalLogin('test', maliciousScript)
      })
      await expect(pm.loginPage().message).toContainText('Suspicious input detected. Please enter valid credentials.');
    })
  })

