const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/playwright/LoginPage');

test.describe('Login Page - POM Pattern', () => {

    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test('should login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        
        // After login, verify we're on the products page
        await loginPage.page.waitForURL('**/inventory.html');
        expect(loginPage.page.url()).toContain('inventory.html');
    });

    test('should display error message with invalid credentials', async () => {
        await loginPage.login('invalid_user', 'wrong_password');
        
        // Verify error message is visible
        const isVisible = await loginPage.isErrorMessageVisible();
        expect(isVisible).toBe(true);
        
        // Verify error message text
        const errorText = await loginPage.getErrorMessage();
        expect(errorText).toContain('Epic sadface');
    });

    test('should stay on login page after failed login', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        
        // Verify we're still on login page
        expect(loginPage.page.url()).toContain('saucedemo.com');
        expect(loginPage.page.url()).not.toContain('inventory.html');
    });
});