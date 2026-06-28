const { Builder, until } = require('selenium-webdriver');
const { expect } = require('chai');
const LoginPage = require('../../pages/selenium/LoginPage');

describe('Login Page - POM Pattern (Selenium)', function () {
    this.timeout(15000);
    let driver;
    let loginPage;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        loginPage = new LoginPage(driver);
        await loginPage.goto();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should login successfully with valid credentials', async function () {
        await loginPage.login('standard_user', 'secret_sauce');
        
        // Verify we're on the products page
        await driver.wait(until.urlContains('inventory.html'), 5000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('inventory.html');
    });

    it('should display error message with invalid credentials', async function () {
        await loginPage.login('invalid_user', 'wrong_password');
        
        // Verify error message is visible
        const isVisible = await loginPage.isErrorMessageVisible();
        expect(isVisible).to.be.true;
        
        // Verify error message text
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).to.include('Epic sadface');
    });

    it('should stay on login page after failed login', async function () {
        await loginPage.login('locked_out_user', 'secret_sauce');
        
        // Verify we're still on login page
        const url = await driver.getCurrentUrl();
        expect(url).to.include('saucedemo.com');
        expect(url).to.not.include('inventory.html');
    });
});