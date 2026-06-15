const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('File Upload Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/upload');
    });

    test('should upload a txt file successfully', async ({ page }) => {
        // Build absolute path to the test file
        const filePath = path.resolve(__dirname, '../selenium-automation/testfile.txt');

        // Inject the file path directly into the input
        await page.setInputFiles('#file-upload', filePath);

        // Click the upload button
        await page.click('#file-submit');

        // Wait for confirmation and verify
        await page.waitForSelector('#uploaded-files');
        const confirmation = await page.locator('#uploaded-files').textContent();

        expect(confirmation.trim()).toBe('testfile.txt');
    });

    test('should upload a jpg file successfully', async ({ page }) => {
        // Build absolute path to the jpg file
        const filePath = path.resolve(__dirname, '../selenium-automation/testimage.jpg');

        // Inject the file path directly into the input
        await page.setInputFiles('#file-upload', filePath);

        // Click the upload button
        await page.click('#file-submit');

        // Wait for confirmation and verify
        await page.waitForSelector('#uploaded-files');
        const confirmation = await page.locator('#uploaded-files').textContent();

        expect(confirmation.trim()).toBe('testimage.jpg');
    });
});