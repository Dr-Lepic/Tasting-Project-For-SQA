/**
 * forgot_password.test.js
 * Tests the Forgot Password page UI and validation bugs.
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

describe('Forgot Password Page Tests', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () { await driver.quit(); });

  it('TC-N-13 Forgot Password page renders a heading ✅', async function () {
    await goTo(driver, '/forgot-password');
    const heading = await el(driver, 'h1, h2');
    assert.ok((await heading.getText()).length > 0, 'Forgot Password page must have a heading');
  });

  it('TC-N-14 Forgot Password page has an email input ✅', async function () {
    await goTo(driver, '/forgot-password');
    assert.ok(await hasEl(driver, 'input[type="email"], input[name="email"]'), 'Email input must exist');
  });

  it('TC-N-15 Forgot Password page has a submit button ✅', async function () {
    await goTo(driver, '/forgot-password');
    assert.ok(await hasEl(driver, 'button[type="submit"]'), 'Submit button must exist');
  });

  it('TC-B-16 Empty email on Forgot Password shows validation error ❌ (Bug: no validation)', async function () {
    await goTo(driver, '/forgot-password');
    await (await el(driver, 'button[type="submit"]')).click();
    await driver.sleep(1500);
    const hasError = await hasEl(driver, '.error, .alert, [role="alert"], p.text-red, span.text-red');
    // FAILS — no client-side empty-email validation exists on forgot password
    assert.ok(hasError, 'Expected validation error for empty email on Forgot Password (Bug)');
  });
});
