const { test, expect } = require('@playwright/test');
const ProductsPage = require('../../pages/playwright/ProductsPage');

test.describe('Products Page - POM Pattern (Playwright)', () => {

    let productsPage; 

    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page);
        await productsPage.goto();
        
        // Login
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        
        // Wait for products page to load
        await page.waitForSelector('.inventory_item');
    });

    test('should display 6 products on the inventory page', async () => {
        const count = await productsPage.getProductCount();
        expect(count).toBe(6);
    });

    test('should add a product to cart by name', async () => {
        await productsPage.addProductToCart('Sauce Labs Backpack');
        
        const badgeCount = await productsPage.getCartBadgeCount();
        expect(badgeCount).toBe('1');
    });

    test('should sort products by price and verify lowest price first', async () => {
        await productsPage.sortByPrice('lohi');
        
        // Wait for the sort to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const firstPrice = await productsPage.getFirstProductPrice();
        expect(firstPrice).toBe('$7.99');
    });

    test('should add multiple products to cart', async () => {
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await new Promise(resolve => setTimeout(resolve, 500));
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        const badgeCount = await productsPage.getCartBadgeCount();
        expect(badgeCount).toBe('2');
    });

    test('should get product price by name', async () => {
        const price = await productsPage.getProductPrice('Sauce Labs Backpack');
        expect(price).toBe('$29.99');
    });

    test('should display all product names', async () => {
        const names = await productsPage.getAllProductNames();
        
        expect(names.length).toBe(6);
        expect(names).toContain('Sauce Labs Backpack');
        expect(names).toContain('Sauce Labs Bike Light');
    });
});