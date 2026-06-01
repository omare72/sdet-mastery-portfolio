const { Builder, Browser, until, By } = require("selenium-webdriver");
const {expect} = require("chai");

describe("Selenium smoke test suite", function() {
  this.timeout(20000);// Gives slow connections 20 seconds to load
  let driver;

  //setup: this runs before the test starts
  before(async function(){
    driver = await new Builder().forBrowser(Browser.CHROME).build();
  });

  // Cleanup: This runs AFTER the test finishes
 after(async function () {
  if (driver) {
      await driver.quit();
    }
  }); 

  it("verify website title on Example.com", async function(){
  // 1. Navigate to the website
  await driver.get("https://Example.com");

  // 2. Target Explicit Wait: Wait up to 5 seconds for the <h1> tag to be located
  const headerElement = await driver.wait(until.elementLocated(By.css('h1')), 5000);


  // 3. Extract the visible text from that element
  const headerText = await headerElement.getText();

    // 4. Assert that the header text matches exactly
  expect(headerText).to.equal('Example Domain');
  });

});

 
