This is just a test project that simulates chrome extension and how to test using custome fixture.
Note: Playwright atm can support chrome extensions and chromium based browsers using (Manifest v3), firefox and safari is not supported yet. This test only runs chromium browsers, other browser is disabled in the playwright config.

Local Development:
Note: Without the .env file this test project will not run, all of the environment,users and app related constant will be fetch under .env file.
.env should be manually created on your local development machine with properties listed below
i.e .env
TEST_USERNAME,
TEST_PASSWORD,
SECRET_KEY,
TEST_EXTENSION,
RESTFUL_API,

PageObjects: All page object is under page_obj folder it holds the selector for each web elements page
API Folder: Contains the api test data and will be used for CRUD Test, it also hold the object of the resufull api

Test Run: Test can be triggered from the terminal using this pre-made commands
i.e: npm run test:mobile:pixel

"test": "npx playwright test",
"test:debug": "npx playwright test --debug",
"test:uimode": "npx playwright test --ui",
"test:smoke": "npx playwright test --grep @Smoke",
"test:regression": "npx playwright test --grep @Regression",
"test:ui": "npx playwright test --grep @Ui",
"test:api": "npx playwright test --project=\"API Tests\"",
"test:desktop:chrome": "npx playwright test --project=\"Desktop (chromium)\"",
"test:desktop:edge": "npx playwright test --project=\"Dekstop (Microsoft Edge)\"",
"test:mobile:iphone": "npx playwright test --project=\"Mobile Chrome (iPhone 12)\"",
"test:mobile:pixel": "npx playwright test --project=\"Mobile Chrome (Pixel 5)\""
