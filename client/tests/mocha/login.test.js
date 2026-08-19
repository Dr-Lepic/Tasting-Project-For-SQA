/**
 * login.test.js
 * Tests the Login page UI: inputs, button, and validation bugs.
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

describe('Login Page Tests', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () { await driver.quit(); });

  it('TC-N-01 Login page renders a heading ✅', async function () {
    await goTo(driver, '/login');
    const heading = await el(driver, 'h1, h2');
    assert.ok((await heading.getText()).length > 0, 'Login page must have a heading');
  });

  it('TC-N-02 Login page has an email input ✅', async function () {
    await goTo(driver, '/login');
    assert.ok(await hasEl(driver, 'input[type="email"], input[name="email"]'), 'Email input must exist');
  });

  it('TC-N-03 Login page has a password input ✅', async function () {
    await goTo(driver, '/login');
    assert.ok(await hasEl(driver, 'input[type="password"]'), 'Password input must exist');
  });

  it('TC-N-04 Login page has a submit button ✅', async function () {
    await goTo(driver, '/login');
    assert.ok(await hasEl(driver, 'button[type="submit"]'), 'Submit button must exist');
  });

  it('TC-B-05 Empty password shows validation error ❌ (Bug: no client-side validation)', async function () {
    await goTo(driver, '/login');
    await (await el(driver, 'input[type="email"], input[name="email"]')).sendKeys('any@iut-dhaka.edu');
    await (await el(driver, 'button[type="submit"]')).click();
    await driver.sleep(1500);
    const hasError = await hasEl(driver, '.error, .alert, [role="alert"], p.text-red, span.text-red');
    // FAILS — no client-side empty-password validation exists
    assert.ok(hasError, 'Expected validation error for empty password (Bug)');
  });

  it('TC-B-06 Wrong credentials show an error message ❌ (Bug: no error UI rendered)', async function () {
    await goTo(driver, '/login');
    await (await el(driver, 'input[type="email"], input[name="email"]')).sendKeys('wrong@iut-dhaka.edu');
    await (await el(driver, 'input[type="password"]')).sendKeys('wrongpassword');
    await (await el(driver, 'button[type="submit"]')).click();
    await driver.sleep(2000);
    const hasError = await hasEl(driver, '.error, .alert, [role="alert"]');
    // FAILS — no error message element is rendered for bad credentials
    assert.ok(hasError, 'Expected error message for wrong credentials (Bug)');
  });
});
