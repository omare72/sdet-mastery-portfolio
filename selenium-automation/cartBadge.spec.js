const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Cart Badge Tests', function () {
    this.timeout(30000);
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://www.saucedemo.com');
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should update cart badge when 3 items are added', async function () {
        // Use JavaScript to force click each button
        const backpack = await driver.findElement(By.css('[data-test="add-to-cart-sauce-labs-backpack"]'));
        await driver.executeScript('arguments[0].click();', backpack);
        await driver.sleep(1000);

        const bikeLight = await driver.findElement(By.css('[data-test="add-to-cart-sauce-labs-bike-light"]'));
        await driver.executeScript('arguments[0].click();', bikeLight);
        await driver.sleep(1000);

        const boltShirt = await driver.findElement(By.css('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'));
        await driver.executeScript('arguments[0].click();', boltShirt);
        await driver.sleep(1000);

        // Wait for cart badge and verify count
        await driver.wait(until.elementLocated(By.css('.shopping_cart_badge')), 5000);
        const badgeCount = await driver.findElement(By.css('.shopping_cart_badge')).getText();
        console.log('Cart badge count:', badgeCount);

        expect(badgeCount).to.equal('3');
    });
});