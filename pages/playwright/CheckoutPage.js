// pages/playwright/CheckoutPage.js
const { expect } = require('@playwright/test');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        // Form Fields
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        
        // Buttons
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        
        // Validations
        this.errorMessage = page.locator('[data-test="error"]');
        this.successHeader = page.locator('.complete-header'); // "Thank you for your order!"
    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        // Using .fill() based on our Block 1 discussion!
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }
}

module.exports = { CheckoutPage };