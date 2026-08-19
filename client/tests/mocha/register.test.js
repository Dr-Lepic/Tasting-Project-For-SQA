/**
 * register.test.js
 * Tests the Register page UI: inputs, button, and validation bugs.
 *
 * ✅ TC-N-* → Normal cases  (Should PASS)
 * ❌ TC-B-* → Bug cases     (Should FAIL — intentional)
 */

import { Builder, By, until } from 'selenium-webdriver';
import assert from 'node:assert';

const BASE = 'http://localhost:5173';
const T = 8000;

async function goTo(d, path) { await d.get(`${BASE}${path}`); }
async function el(d, css) { return d.wait(until.elementLocated(By.css(css)), T); }
async function hasEl(d, css) { return (await d.findElements(By.css(css))).length > 0; }

describe('Register Page Tests', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () { await driver.quit(); });

  it('TC-N-07 Register page renders a heading ✅', async function () {
    await goTo(driver, '/register');
    const heading = await el(driver, 'h1, h2');
    assert.ok((await heading.getText()).length > 0, 'Register page must have a heading');
  });

  it('TC-N-08 Register page has a name input ✅', async function () {
    await goTo(driver, '/register');
    assert.ok(await hasEl(driver, 'input[name="name"]'), 'Name input must exist');
  });

  it('TC-N-09 Register page has an email input ✅', async function () {
    await goTo(driver, '/register');
    assert.ok(await hasEl(driver, 'input[type="email"], input[name="email"]'), 'Email input must exist');
  });

  it('TC-N-10 Register page has a password input ✅', async function () {
    await goTo(driver, '/register');
    assert.ok(await hasEl(driver, 'input[type="password"]'), 'Password input must exist');
  });

  it('TC-N-11 Register page has a submit button ✅', async function () {
    await goTo(driver, '/register');
    assert.ok(await hasEl(driver, 'button[type="submit"]'), 'Submit button must exist');
  });

  it('TC-B-12 Mismatched passwords show a validation error ❌ (Bug: no client-side validation)', async function () {
    await goTo(driver, '/register');
    const pwInputs = await driver.findElements(By.css('input[type="password"]'));
    if (pwInputs.length >= 2) {
      await pwInputs[0].sendKeys('Password1');
      await pwInputs[1].sendKeys('DifferentPass9');
    } else if (pwInputs.length === 1) {
      await pwInputs[0].sendKeys('Password1');
    }
    await (await el(driver, 'button[type="submit"]')).click();
    await driver.sleep(1500);
    const hasError = await hasEl(driver, '.error, .alert, [role="alert"], p.text-red, span.text-red');
    // FAILS — no client-side password-match validation exists
    assert.ok(hasError, 'Expected password mismatch error (Bug)');
  });
});
