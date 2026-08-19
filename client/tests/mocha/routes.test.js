/**
 * routes.test.js
 * Tests protected route redirects and navigation links.
 * Unauthenticated users must always be redirected to /login.
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
async function redirectsToLogin(driver, path) {
  await goTo(driver, path);
  await driver.wait(until.urlContains('/login'), T);
  return (await driver.getCurrentUrl()).includes('/login');
}

describe('Route Protection & Navigation Tests', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () { await driver.quit(); });

  // ── Protected route redirects ──────────────────────────────────────────────

  it('TC-N-17 Unauthenticated /profile redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/profile'), '/profile must redirect to /login');
  });

  it('TC-N-18 Unauthenticated /leave-application redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/leave-application'), '/leave-application must redirect to /login');
  });

  it('TC-N-19 Unauthenticated /leave-history redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/leave-history'), '/leave-history must redirect to /login');
  });

  it('TC-N-20 Unauthenticated /members redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/members'), '/members must redirect to /login');
  });

  it('TC-N-21 Unauthenticated /alternate-requests redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/alternate-requests'), '/alternate-requests must redirect to /login');
  });

  it('TC-N-22 Unauthenticated /application-status redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/application-status'), '/application-status must redirect to /login');
  });

  it('TC-N-23 Unauthenticated /hr/dashboard redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/hr/dashboard'), '/hr/dashboard must redirect to /login');
  });

  it('TC-N-24 Unauthenticated /hr/employees redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/hr/employees'), '/hr/employees must redirect to /login');
  });

  it('TC-N-25 Unauthenticated /hod/dashboard redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/hod/dashboard'), '/hod/dashboard must redirect to /login');
  });

  it('TC-N-26 Unauthenticated /hod/pending-requests redirects to /login ✅', async function () {
    assert.ok(await redirectsToLogin(driver, '/hod/pending-requests'), '/hod/pending-requests must redirect to /login');
  });

  // ── Navigation links ───────────────────────────────────────────────────────

  it('TC-N-27 Login page has a link to /register ✅', async function () {
    await goTo(driver, '/login');
    assert.ok(await hasEl(driver, 'a[href="/register"]'), 'Login page must link to /register');
  });

  it('TC-N-28 Clicking Register link navigates to /register ✅', async function () {
    await goTo(driver, '/login');
    const link = await el(driver, 'a[href="/register"]');
    await link.click();
    await driver.wait(until.urlContains('/register'), T);
    assert.ok((await driver.getCurrentUrl()).includes('/register'), 'Must navigate to /register');
  });

  it('TC-B-29 Login page has a Forgot Password link ❌ (Bug: link missing)', async function () {
    await goTo(driver, '/login');
    const exists = await hasEl(driver, 'a[href="/forgot-password"]');
    // FAILS — the forgot-password anchor link is missing from the login form
    assert.ok(exists, 'Login page must have a Forgot Password link (Bug: link is missing)');
  });
});
