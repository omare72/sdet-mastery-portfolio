const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const LoginPage = require('../../pages/selenium/LoginPage');
const ProductsPage = require('../../pages/selenium/ProductsPage');
const CartPage = require('../../pages/selenium/CartPage');

describe('Cart Page - POM Pattern (Selenium)', function () {
    this.timeout(15000);
    this.slow(1000); // Tells Mocha that anything under 1 second is considered "fast" for a UI test
    let driver;
    let cartPage;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        
        // 1. Log in to the application
        const loginPage = new LoginPage(driver);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        
        // 2. Wait for the inventory page to fully load
        await driver.wait(until.elementLocated(By.css('.inventory_item')), 5000);
        
        // 3. Add products to the cart using the page object
        const productsPage = new ProductsPage(driver);
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        // 4. Safely locate, ensure visibility, and click the cart icon
        const cartLink = await driver.wait(until.elementLocated(By.css('.shopping_cart_link')), 5000);
        await driver.wait(until.elementIsVisible(cartLink), 5000);
        await cartLink.click();
        
        // 5. Explicitly wait for the cart page items to load before initializing CartPage
        await driver.wait(until.elementLocated(By.css('.cart_item')), 5000);
        
        // Initialize CartPage
        cartPage = new CartPage(driver);
    });

    afterEach(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should display cart items', async function () {
        const count = await cartPage.getCartItemCount();
        expect(count).to.equal(2);
    });

    it('should get item price from cart', async function () {
        const price = await cartPage.getItemPrice('Sauce Labs Backpack');
        expect(price).to.equal('$29.99');
    });

    it('should remove item from cart', async function () {
        await cartPage.removeItemFromCart('Sauce Labs Backpack');
        
        const count = await cartPage.getCartItemCount();
        //console.log(count);
        expect(count).to.equal(1);
    });

    it('should get all cart item names', async function () {
        const names = await cartPage.getAllCartItemNames();
        
        expect(names.length).to.equal(2);
        expect(names).to.include('Sauce Labs Backpack');
        expect(names).to.include('Sauce Labs Bike Light');
    });

    it('should navigate to checkout', async function () {
        await cartPage.clickCheckout();
        
        // Verify we're on checkout page
        await driver.wait(until.urlContains('checkout-step-one.html'), 5000);
        const url = await driver.getCurrentUrl();
        expect(url).to.include('checkout-step-one.html');
    });
});