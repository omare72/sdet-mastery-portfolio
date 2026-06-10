const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');

describe('File Upload Tests', function () {
    this.timeout(15000);
    let driver;

    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('https://the-internet.herokuapp.com/upload');
    });

    afterEach(async function () {
        await driver.quit();
    });

    it('should upload a file successfully', async function () {
        // Build absolute path to the test file
        const filePath = path.resolve(__dirname, 'testfile.txt');

        // Inject the file path directly into the input
        await driver.findElement(By.id('file-upload')).sendKeys(filePath);

        // Click the upload button
        await driver.findElement(By.id('file-submit')).click();

        // Wait for confirmation and verify
        await driver.wait(until.elementLocated(By.id('uploaded-files')), 5000);
        const confirmation = await driver.findElement(By.id('uploaded-files')).getText();

        expect(confirmation).to.equal('testfile.txt');
    });
});