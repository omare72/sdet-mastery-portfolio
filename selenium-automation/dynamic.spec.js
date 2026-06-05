const { Builder, Browser, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Selenium Advanced Locators Suite', function () {
  this.timeout(20000); 
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Handle dynamic items using XPath text filtering parent-child chains', async function () {
    // 1. Navigate and login
    await driver.get('https://saucedemo.com');

    // 2. GATEKEEPER: Explicitly wait for the login field to be ready BEFORE typing
    const usernameField = await driver.wait(until.elementLocated(By.id('user-name')), 5000);
    await usernameField.sendKeys('standard_user');    
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // 3. Wait for the catalog page to load
    await driver.wait(until.elementLocated(By.className('inventory_list')), 5000);

    // 4. TARGET THE DYNAMIC CARD USING XPATH TEXT FILTERING
    // This locates the product container that contains the text 'Sauce Labs Backpack'
    const backpackCardXPath = "//*[contains(@class, 'inventory_item')][.//div[text()='Sauce Labs Backpack']]";
    const backpackCard = await driver.findElement(By.xpath(backpackCardXPath));

    // 5. Drill down inside that specific parent card to find and click its button
    const addToCartButton = await backpackCard.findElement(By.xpath(".//button[text()='Add to cart']"));
    await addToCartButton.click();

     // 6. TIMING GATEKEEPER: Wait for the text change globally using a cleaner XPath
    // This scans the page for a button containing the text 'Remove' that belongs to our backpack card
    const stableRemoveBtnXPath = "//*[contains(@class, 'inventory_item')][.//div[text()='Sauce Labs Backpack']]//button";
    const removeButton = await driver.wait(
        until.elementLocated(By.xpath(stableRemoveBtnXPath)), 
        5000
    );

     // 7. Assert the button text changed to 'Remove'
    const buttonText = await removeButton.getText();
    expect(buttonText).to.equal('Remove');

    // 8. Verify the shopping cart badge counts '1'
    //const cartBadge = await driver.findElement(By.className('shopping_cart_badge'));//By.className & By.css both work
    const cartBadge = await driver.wait(until.elementLocated(By.css('.shopping_cart_badge')),5000,"The shopping cart badge did not appear"
  );
    const badgeText = await cartBadge.getText();
    expect(badgeText).to.equal('1');
  });
});
