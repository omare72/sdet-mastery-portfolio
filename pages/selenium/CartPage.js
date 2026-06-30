const { By, until} = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        
        // Locators
        this.cartItem = By.css('.cart_item');
        this.cartItemName = By.css('.inventory_item_name');
        this.cartItemPrice = By.css('.inventory_item_price');
        this.removeButton = By.css('[data-test^="remove-"]');
        this.continueShoppingButton = By.id('continue-shopping');
        this.checkoutButton = By.id('checkout');
    }

    // Methods
    async goto() {
        await this.driver.get('https://www.saucedemo.com/cart.html');
    }

    async getCartItemCount() {
        const items = await this.driver.findElements(this.cartItem);
        return items.length;
    }

    async getCartItemByName(itemName) {
        const items = await this.driver.findElements(this.cartItem);
        
        for (let item of items) {
            const name = await item.findElement(this.cartItemName).getText();
            if (name === itemName) {
                return item;
            }
        }
        return null;
    }

    async getItemPrice(itemName) {
        const item = await this.getCartItemByName(itemName);
        if (item) {
            const price = await item.findElement(this.cartItemPrice).getText();
            return price;
        }
        return null;
    }

    async removeItemFromCart(itemName) {
    const item = await this.getCartItemByName(itemName);
    if (item) {
        // 1. Click the remove button
        await item.findElement(this.removeButton).click();
        
        // 2. Dynamically wait until the total number of .cart_item elements becomes 1
        const { until, By } = require('selenium-webdriver');
        await this.driver.wait(async () => {
            const currentItems = await this.driver.findElements(By.css('.cart_item'));
            return currentItems.length === 1;
        }, 5000, 'Expected cart item count to decrease to 1');
      }
    }

    async clickContinueShopping() {
        await this.driver.findElement(this.continueShoppingButton).click();
    }

    async clickCheckout() {
        await this.driver.findElement(this.checkoutButton).click();
    }

    async getAllCartItemNames() {
        const items = await this.driver.findElements(this.cartItem);
        const itemNames = [];
        
        for (let item of items) {
            const name = await item.findElement(this.cartItemName).getText();
            itemNames.push(name);
        }
        
        return itemNames;
    }

    async isCartEmpty() {
        const items = await this.driver.findElements(this.cartItem);
        return items.length === 0;
    }
}

module.exports = CartPage;