import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */


// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    headless: false,
    screenshot: 'on',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*api\/.*\.spec\.ts/,
    },
    {
      name: 'Desktop (chromium)',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*desktop\/.*\.spec\.ts/,
    },
    {
      name: 'Dekstop (Microsoft Edge)',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      testMatch: /.*desktop\/.*\.spec\.ts/,
    },
    {
      name: 'Mobile Chrome (iPhone 12)',
      use: { ...devices['iPhone 12'] },
      testMatch: /.*mobile\/.*\.spec\.ts/,
    },
    {
      name: 'Mobile Chrome (Pixel 5)',
      use: { ...devices['Pixel 5'] },
      testMatch: /.*mobile\/.*\.spec\.ts/,
    },


    // {
    //   name: 'Desktop (firefox)',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
