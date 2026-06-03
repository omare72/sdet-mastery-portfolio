const { Builder, Browser, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Selenium Automation Suite', function () {
  this.timeout(20000); 
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Verify successful login user flow on SauceLabs', async function () {
    // 1. Navigate to the practice portal
    await driver.get('https://www.saucedemo.com');

    // 2. Explicitly wait for the username field and fill it
    const usernameInput = await driver.wait(until.elementLocated(By.id('user-name')), 5000);
    await usernameInput.sendKeys('standard_user');

    // 3. Locate and fill the password field
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('secret_sauce');

    // 4. Click the login button
    const loginButton = await driver.findElement(By.id('login-button'));
    await loginButton.click();

    // 5. Explicitly wait for the dashboard header to appear and assert text
    const appHeader = await driver.wait(until.elementLocated(By.className('app_logo')), 5000);
    const headerText = await appHeader.getText();
    
    expect(headerText).to.equal('Swag Labs');
  });
});