const { By } = require('selenium-webdriver');

class ProductsPage { 
    constructor(driver) {
        this.driver = driver;
        
        // Locators
        this.productContainer = By.css('.inventory_item');
        this.productName = By.css('.inventory_item_name');
        this.productPrice = By.css('.inventory_item_price');
        this.addToCartButton = By.css('.btn_inventory');
        this.sortDropdown = By.css('.product_sort_container');
        this.cartBadge = By.css('.shopping_cart_badge');
        this.productDescription = By.css('.inventory_item_desc');
    }

    // Methods
    async getProductCount() {
        const products = await this.driver.findElements(this.productContainer);
        return products.length;
    }
    // returns all products by name
    async getAllProductNames() {
        const products = await this.driver.findElements(this.productContainer);
        const productNames = [];
        
        for (let product of products) {
            const name = await product.findElement(this.productName).getText();
            productNames.push(name);
        }
        
        return productNames;
    }//getAllProductNames

    async getProductByName(productName) {
        const products = await this.driver.findElements(this.productContainer);
        for (let product of products) {
            const name = await product.findElement(this.productName).getText();
            if (name === productName) {
                return product;
            }
        }
        return null;
    }

    async addProductToCart(productName) {
        const product = await this.getProductByName(productName);
        if (product) {
            const button = await product.findElement(this.addToCartButton);
            await this.driver.executeScript('arguments[0].click();', button);
        }
    }

    async sortByPrice(sortOption) {
        const dropdown = await this.driver.findElement(this.sortDropdown);
        const options = await dropdown.findElements(By.tagName('option'));
        
        for (let option of options) {
            const text = await option.getText();
            if (sortOption === 'lohi' && text.includes('Price (low to high)')) {
                await option.click();
                break;
            } else if (sortOption === 'hilo' && text.includes('Price (high to low)')) {
                await option.click();
                break;
            }
        }
    }

    async getFirstProductPrice() {
        const firstProduct = await this.driver.findElement(this.productContainer);
        const priceText = await firstProduct.findElement(this.productPrice).getText();
        return priceText;
    }

    async getProductPrice(productName) {
        const product = await this.getProductByName(productName);
        const price = await product.findElement(this.productPrice).getText();
        return price;
    }

    async getProductDescription(productName) {
        const product = await this.getProductByName(productName);
        const desc = await product.findElement(this.productDescription).getText();
        return desc;
    }

    async getCartBadgeCount() {
        try {
            const badge = await this.driver.findElement(this.cartBadge);
            return await badge.getText();
        } catch (e) {
            return '0';
        }
    }
}

module.exports = ProductsPage;