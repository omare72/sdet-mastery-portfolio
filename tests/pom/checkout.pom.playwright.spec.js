// tests/pom/checkout.pom.playwright.spec.js
const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('../../pages/playwright/CheckoutPage');

test.describe('Checkout Flow - POM Pattern', () => {
    
    test.beforeEach(async ({ page }) => {
        test.slow();
        // 1. Navigate to the site and log in (Prerequisite)
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // 2. Add an item to the cart and navigate to checkout
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('.shopping_cart_link').click();
        await page.locator('[data-test="checkout"]').click();
    });

    test('Should successfully complete checkout with valid information', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        // Step 1: Fill out the shipping information form
        await checkoutPage.fillCheckoutForm('Tom', 'Brady', '02045');
        await checkoutPage.clickContinue();

        // Step 2: Verify we are on the overview page before finishing
        await expect(page).toHaveURL(/.*checkout-step-two/);

        // Step 3: Finish the order and assert success message
        await checkoutPage.finishOrder();
        await expect(checkoutPage.successHeader).toHaveText('Thank you for your order!');
    });

    test('Should display an error message when missing required fields', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        // Intentionally leave fields blank and click continue
        await checkoutPage.clickContinue();

        // Assert error message triggers validation handling
        await expect(checkoutPage.errorMessage).toBeVisible();
        await expect(checkoutPage.errorMessage).toContainText('Error: First Name is required');
    });
});