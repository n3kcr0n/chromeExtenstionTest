Playwright Chrome Extension Test Project

This project demonstrates how to test a Chrome Extension using Playwright with a custom fixture setup.
It simulates extension behavior and validates functionality across various test cases in a Chromium environment.

Note:
Playwright currently supports Chromium-based browsers with Manifest V3 extensions.
Firefox and Safari are not supported at this time.
All tests in this project are configured to run only on Chromium — other browsers are disabled in the Playwright configuration.

⚙️ Setup & Installation

1. Clone the Repository
   git clone <repository-url>
   cd <project-directory>

2. Install Dependencies
   Ensure you have Node.js (v18 or later) installed, then run:
   npm install

3. Create a .env File
   This project requires a .env file for environment variables. Without it, the tests will not execute.
   Create a .env file in the project root and include the following variables:
   💡 Tip: Never commit your .env file to version control. Keep it local and secure.
   TEST_USERNAME=,
   TEST_PASSWORD=,
   SECRET_KEY=,
   TEST_EXTENSION=,
   RESTFUL_API=,

4. Run Tests
   Use any of the pre-defined npm scripts to start a test run.
   Example: npm run test:ui //This will execute evert Ui test

🧱 Project Structure
Folder / File Description
page_obj/ Contains Page Object Models defining selectors, actions, and reusable UI interactions.
api/ Holds API test data, test payloads, and CRUD operation methods for RESTful endpoints.
tests/ Contains the main test suites executed via Playwright.
playwright.config.ts Defines test configuration, environment settings, and browser options.

🧩 Local Development Notes

The .env file is mandatory for all test runs.
Environment variables define credentials, app constants, and configuration keys.
Test execution is limited to Chromium browsers for Manifest V3 compatibility.
Custom fixtures handle setup, teardown, and browser context management.

🚀 Running Tests
To execute tests from the terminal, use the provided npm commands.
Refer to your package.json for a complete list of available test scripts.

Examples:
npm run test:ui
npm run test:api
npm run test:debug
npm run test:uimode
