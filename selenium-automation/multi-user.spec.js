const { Builder, Browser, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Selenium Data-Driven Persona Suite', function () {
  this.timeout(30000); 
  let driver;

  beforeEach(async function () {
    // Fresh browser instance before each user iteration to prevent cookie bleed
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  afterEach(async function () {
    // Cleanly close the browser session after each user test finishes
    if (driver) {
      await driver.quit();
    }
  });

  // Test Data Array mapping out distinct application personas
  const users = [
    { username: 'standard_user', expectedUrl: /inventory\.html/, shouldFail: false },
    { username: 'locked_out_user', shouldFail: true }
  ];

  users.forEach((user) => {
    it(`Verify authentication behavior for persona: ${user.username}`, async function () {
      // 1. Navigate to portal
      await driver.get('https://saucedemo.com');

      // 2. Gatekeeper Wait for initial page stabilization
      const usernameInput = await driver.wait(until.elementLocated(By.id('user-name')), 5000);
      await usernameInput.sendKeys(user.username);

      await driver.findElement(By.id('password')).sendKeys('secret_sauce');
      await driver.findElement(By.id('login-button')).click();

      // 3. Conditional validation based on persona expectation
      if (user.shouldFail) {
        // Wait for the explicit error element to structurally appear on the screen
        const errorContainer = await driver.wait(
          until.elementLocated(By.css('[data-test="error"]')), 
          5000
        );
        const errorText = await errorContainer.getText();
        expect(errorText).to.include('Sorry, this user has been locked out.');
      } else {
        // Explicitly wait for the landing page URL profile match pattern
        await driver.wait(until.urlMatches(user.expectedUrl), 5000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.match(user.expectedUrl);
      }
    });
  });
});
