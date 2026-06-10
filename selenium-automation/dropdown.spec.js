const { Builder, By } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Dropdown Tests', function () {
    this.timeout(15000);
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

    it('should sort products by Price (low to high)', async function () {
        const dropdown = await driver.findElement(By.className('product_sort_container'));
        const options = await dropdown.findElements(By.tagName('option'));

        for (let option of options) {
            const text = await option.getText();
            if (text === 'Price (low to high)') {
                await option.click();
                break;
            }
        }

        const selected = await driver.findElement(By.css('.product_sort_container option:checked')).getText();
        expect(selected).to.equal('Price (low to high)');
    });
});