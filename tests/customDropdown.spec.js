const { test, expect } = require('@playwright/test');

test.describe('Custom Dropdown Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
    });

    test('should sort products by Price (low to high)', async ({ page }) => {
        // Click the dropdown trigger
        await page.locator('.product_sort_container').selectOption({ label: 'Price (low to high)' });

        // Verify the selection
        const selected = await page.locator('.product_sort_container').inputValue();
        expect(selected).toBe('lohi');

        // Verify first product price is the lowest
        const firstPrice = await page.locator('.inventory_item_price').first().textContent();
        console.log('First product price:', firstPrice);
        expect(firstPrice).toBe('$7.99');
    });
});