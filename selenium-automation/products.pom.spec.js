const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const ProductsPage = require('../pages/selenium/ProductsPage');

describe('Products Page - POM Pattern', function () {
    this.timeout(15000);
    let driver;
    let productsPage;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://www.saucedemo.com');
        
        // Login first
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();
        
        // Wait for products page to load
        await driver.wait(until.elementLocated(By.css('.inventory_item')), 5000);
        
        // Initialize ProductsPage
        productsPage = new ProductsPage(driver);
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should display 6 products on the inventory page', async function () {
        const count = await productsPage.getProductCount();        
        expect(count).to.equal(6);
    });

    it('should add a product to cart by name', async function () {
        await productsPage.addProductToCart('Sauce Labs Backpack');
        
        const badgeCount = await productsPage.getCartBadgeCount();
        expect(badgeCount).to.equal('1');
    });

    it('should display all product names', async function () {
        const names = await productsPage.getAllProductNames();
        console.log('Products:', names);
        
        expect(names).to.include('Sauce Labs Backpack');
        expect(names).to.include('Sauce Labs Bike Light');
        expect(names.length).to.equal(6);
    });

    it('should sort products by price and verify lowest price first', async function () {
        await productsPage.sortByPrice('lohi');
        
        // Wait for the first product price to change to the lowest
        await driver.wait(async function () {
            const price = await productsPage.getFirstProductPrice();
            return price === '$7.99';
        }, 5000);
        
        const firstPrice = await productsPage.getFirstProductPrice();
        expect(firstPrice).to.equal('$7.99');
    });

    it('should add multiple products to cart', async function () {
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await driver.sleep(500);
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        await driver.sleep(500);
        
        const badgeCount = await productsPage.getCartBadgeCount();
        expect(badgeCount).to.equal('2');
    });
});