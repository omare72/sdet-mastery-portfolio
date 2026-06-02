const {test, expect} = require("@playwright/test");

test("Verify successful login flow", async ({page})=>{
    // 1. Navigate to a secure practice login portal
    await page.goto("https://saucedemo.com");
    // 2. Fill the username input field using its accessible label or selector
    const usernameInput =  page.getByPlaceholder("Username");
    await usernameInput.fill("standard_user");
    // 3. Fill the password input field  
    await page.getByPlaceholder('Password').fill("secret_sauce");
    // 4. Click the login submit button using its text role
    const submitBtn =  page.getByRole('button', {name:'Login'});
    await submitBtn.click();
    // 5. Assert that the login was successful by checking the header banner text
    const title =  page.locator(".app_logo");
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Swag Labs');

})