const { test, expect } = require('@playwright/test');

test("Verify successful navigation and search",async ({page})=>{
  // 1. Navigate to a live, stable practice site
  await page.goto("https://example.com");
  // 2. Assert (verify) that the page title is correct
  await expect(page).toHaveTitle("Example Domain");
  
  // 3. Find the 'More information' link using its role and click it  
  const infoLink = page.getByRole('link', {name: 'Learn more'});
  await infoLink.click();

  // 4. Assert that the new page URL contains the word 'iana'
  await expect(page).toHaveURL(/.*iana*./);
});