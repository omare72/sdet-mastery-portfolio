const { By, until } = require('selenium-webdriver');

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        
        // Locators
        this.usernameInput = By.id('user-name');
        this.passwordInput = By.id('password');
        this.loginButton = By.id('login-button');
        this.errorMessage = By.css('[data-test="error"]');// what do i need this for?
    }

    // Methods
    async goto() {
        await this.driver.get('https://www.saucedemo.com');
    }

    async login(username, password) {
        await this.driver.findElement(this.usernameInput).sendKeys(username);
        await this.driver.findElement(this.passwordInput).sendKeys(password);
        await this.driver.findElement(this.loginButton).click();
    }

    async getErrorMessage() {
        const error = await this.driver.findElement(this.errorMessage);
        return await error.getText();
    }

    async isErrorMessageVisible() {
        try {
            await this.driver.findElement(this.errorMessage);
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = LoginPage;