const { test, expect } = require('@playwright/test');

test.describe('Playwright Advanced Locators Suite', () => {

    test('Handle elements using text filtering and relative positioning', async ({ page }) => {
        // 1. Navigate to the inventory page directly
        await page.goto('https://saucedemo.com');
        
        // Quick bypass authentication for setup
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        
        // 2. Target an item card dynamically by its internal text element
        // This avoids relying on raw index numbers that change when inventory updates
        const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
        
        // 3. Drill down inside that specific filtered card to click its button
        const addToCartButton = backpackCard.getByRole('button', { name: 'Add to cart' });
        await addToCartButton.click();
        
        // 4. Assert the change dynamically inside the inventory card
        const removeButton = backpackCard.getByRole('button', { name: 'Remove' });
        await expect(removeButton).toBeVisible();
        
        // 5. Verify the shopping cart badge counts the addition
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('1');
    });
});
