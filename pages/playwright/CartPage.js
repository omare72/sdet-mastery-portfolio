class CartPage {
    constructor(page) {
        this.page = page;
        
        // Locators
        this.cartItem = '.cart_item';
        this.cartItemName = '.inventory_item_name';
        this.cartItemPrice = '.inventory_item_price';
        this.cartItemQuantity = '.cart_quantity';
        this.removeButton = '[data-test^="remove-"]';
        this.continueShoppingButton = '#continue-shopping';
        this.checkoutButton = '#checkout';
        this.cartBadge = '.shopping_cart_badge';
    }

    // Methods
    async goto() {
        await this.page.goto('https://www.saucedemo.com/cart.html');
    }

    async getCartItemCount() {
        const items = await this.page.locator(this.cartItem).all();
        return items.length;
    }

    async getCartItemByName(itemName) {
        const items = await this.page.locator(this.cartItem).all();
        
        for (let item of items) {
            const name = await item.locator(this.cartItemName).textContent();
            if (name === itemName) {
                return item;
            }
        }
        return null;
    }

    async getItemPrice(itemName) {
        const item = await this.getCartItemByName(itemName);
        if (item) {
            const price = await item.locator(this.cartItemPrice).textContent();
            return price.trim();
        }
        return null;
    }

    async removeItemFromCart(itemName) {
        const item = await this.getCartItemByName(itemName);
        if (item) {
            await item.locator(this.removeButton).click();
        }
    }

    async clickContinueShopping() {
        await this.page.locator(this.continueShoppingButton).click();
    }

    async clickCheckout() {
        await this.page.locator(this.checkoutButton).click();
    }

    async getAllCartItemNames() {
        const items = await this.page.locator(this.cartItem).all();
        const itemNames = [];
        
        for (let item of items) {
            const name = await item.locator(this.cartItemName).textContent();
            itemNames.push(name.trim());
        }
        
        return itemNames;
    }

    async isCartEmpty() {
        const items = await this.page.locator(this.cartItem).all();
        return items.length === 0;
    } 
}

module.exports = CartPage;