const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/playwright/LoginPage');
const ProductsPage = require('../../pages/playwright/ProductsPage');
const CartPage = require('../../pages/playwright/CartPage');

test.describe('Cart Page - POM Pattern (Playwright)', () => {

    let cartPage;

    test.beforeEach(async ({ page }) => {
        // Login and add items to cart
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
        
        // Wait for products page
        await page.waitForSelector('.inventory_item');
        
        // Add 2 products to cart
        const productsPage = new ProductsPage(page);
        await productsPage.addProductToCart('Sauce Labs Backpack');
        await page.waitForTimeout(500);
        await productsPage.addProductToCart('Sauce Labs Bike Light');
        
        // Navigate to cart
        await page.click('.shopping_cart_link');
        await page.waitForSelector('.cart_item');
        
        // Initialize CartPage
        cartPage = new CartPage(page);
    });

    test('should display cart items', async () => {
        const count = await cartPage.getCartItemCount();
        expect(count).toBe(2);
    });

    test('should get item price from cart', async () => {
        const price = await cartPage.getItemPrice('Sauce Labs Backpack');
        expect(price).toBe('$29.99');
    });

    test('should remove item from cart', async () => {
        await cartPage.removeItemFromCart('Sauce Labs Backpack');
        
        const count = await cartPage.getCartItemCount();
        expect(count).toBe(1);
    });

    test('should get all cart item names', async () => {
        const names = await cartPage.getAllCartItemNames();
        
        expect(names.length).toBe(2);
        expect(names).toContain('Sauce Labs Backpack');
        expect(names).toContain('Sauce Labs Bike Light');
    });

    test('should navigate to checkout', async ({ page }) => {
        await cartPage.clickCheckout();
        
        // Verify we're on checkout page
        await page.waitForURL('**/checkout-step-one.html');
        expect(page.url()).toContain('checkout-step-one.html');
    });
});