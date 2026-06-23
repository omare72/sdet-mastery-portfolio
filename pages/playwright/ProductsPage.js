class ProductsPage {
    constructor(page) {
        this.page = page;
        
        // Locators (CSS selectors)
        this.productContainer = '.inventory_item';
        this.productName = '.inventory_item_name';
        this.productPrice = '.inventory_item_price';
        this.addToCartButton = '.btn_inventory';
        this.sortDropdown = '.product_sort_container';
        this.cartBadge = '.shopping_cart_badge';
    }

    // Methods
    async goto() {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
    }

    async getProductCount() {
        const products = await this.page.locator(this.productContainer).all();
        return products.length;
    }

    async getProductByName(productName) {
        const products = await this.page.locator(this.productContainer).all();
        
        for (let product of products) {
            const name = await product.locator(this.productName).textContent();
            if (name === productName) {
                return product;
            }
        }
        return null;
    }

    async addProductToCart(productName) {
        const product = await this.getProductByName(productName);
        if (product) {
            await product.locator(this.addToCartButton).click();
        }
    }

    async sortByPrice(sortOption) {
        if (sortOption === 'lohi') {
            await this.page.locator(this.sortDropdown).selectOption({ label: 'Price (low to high)' });
        } else if (sortOption === 'hilo') {
            await this.page.locator(this.sortDropdown).selectOption({ label: 'Price (high to low)' });
        }
    }

    async getFirstProductPrice() {
        const firstProduct = this.page.locator(this.productContainer).first();
        const priceText = await firstProduct.locator(this.productPrice).textContent();
        return priceText;
    }

    async getCartBadgeCount() {
        try {
            const badge = this.page.locator(this.cartBadge);
            return await badge.textContent();
        } catch (e) {
            return '0';
        }
    }

    async getProductPrice(productName) {
        const product = await this.getProductByName(productName);
        const price = await product.locator(this.productPrice).textContent();
        return price;
    }

    async getAllProductNames() {
        const products = await this.page.locator(this.productContainer).all();
        const productNames = []; 
        
        for (let product of products) {
            const name = await product.locator(this.productName).textContent();
            productNames.push(name);
        }
        
        return productNames;
    }
}

module.exports = ProductsPage;