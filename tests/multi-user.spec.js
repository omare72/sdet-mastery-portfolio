const { test, expect } = require('@playwright/test');

test.describe('Data-Driven Authentication Suite', () => {

  // Array of user objects to test multiple personas dynamically
  const users = [
    { username: 'standard_user', expectedUrl: /inventory\.html/, shouldFail: false },
    { username: 'locked_out_user', shouldFail: true }
  ];

  for (const user of users) {
    test(`Verify authentication behavior for persona: ${user.username}`, async ({ page }) => {
      // 1. Navigate to the login portal
      await page.goto('https://saucedemo.com');

      // 2. Input credentials safely
      await page.locator('[data-test="username"]').fill(user.username);
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();

      // 3. Conditional validation based on the user profile
      if (user.shouldFail) {
        // Assert that a distinct error container becomes visible for the locked out user
        const errorContainer = page.locator('[data-test="error"]');
        await expect(errorContainer).toBeVisible();
        await expect(errorContainer).toContainText('Sorry, this user has been locked out.');
      } else {
        // Assert that the successful user successfully transitions to the inventory dashboard URL
        await expect(page).toHaveURL(user.expectedUrl);
      }
    });
  }
});
