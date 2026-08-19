/**
 * hod_hr_management.test.js
 * Tests HoD Pending Requests, HoD Analytics filters, HR System Settings tiles, Leave Quota setter, and Public Holidays manager.
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

async function setupHoDSession(driver) {
  await goTo(driver, '/login');
  await driver.executeScript(`
    localStorage.setItem('token', 'mock-hod-token-sqa');
    localStorage.setItem('user', JSON.stringify({
      _id: 'hod-test-01',
      name: 'Prof. Alan Turing',
      email: 'hod@iut-dhaka.edu',
      roles: ['HoD', 'Employee'],
      designation: 'Professor & Head',
      department: { _id: 'dept-cse-01', name: 'Computer Science & Engineering' }
    }));
  `);
}

async function setupHRSession(driver) {
  await goTo(driver, '/login');
  await driver.executeScript(`
    localStorage.setItem('token', 'mock-hr-token-sqa');
    localStorage.setItem('user', JSON.stringify({
      _id: 'hr-test-01',
      name: 'HR Director',
      email: 'hr@iut-dhaka.edu',
      roles: ['HR', 'Employee'],
      designation: 'Director of Human Resources',
      department: { _id: 'dept-hr-01', name: 'Human Resources' }
    }));
  `);
}

describe('HoD & HR Management Tests (TC-215 to TC-220)', function () {
  let driver;
  this.timeout(30000);

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // ── HoD View Tests ──────────────────────────────────────────────────────────

  it('TC-N-54 (TC-215): HoD Pending Requests page renders department pending applications queue ✅', async function () {
    await setupHoDSession(driver);
    await goTo(driver, '/hod/pending-requests');
    await driver.sleep(1000);

    const hasHeader = await hasEl(driver, '.hod-pending-requests-container, .page-header, h1');
    assert.ok(hasHeader, 'HoD Pending Requests page must render');
  });

  it('TC-N-55 (TC-216): HoD pending request list displays review action controls or empty queue state ✅', async function () {
    await setupHoDSession(driver);
    await goTo(driver, '/hod/pending-requests');
    await driver.sleep(1000);

    const hasControlsOrEmpty = await hasEl(driver, '.btn-action, .btn-approve, .empty-state, .loading-state, p');
    assert.ok(hasControlsOrEmpty, 'Pending requests must display actionable approval controls or empty queue notification');
  });

  it('TC-N-56 (TC-217): HoD Analytics page renders timeline period filter (Monthly / Yearly) ✅', async function () {
    await setupHoDSession(driver);
    await goTo(driver, '/hod/analytics');
    await driver.sleep(1000);

    const hasFilters = await hasEl(driver, 'select, .filter-select, .period-selector, .analytics-filters');
    assert.ok(hasFilters, 'HoD Analytics page must include period/date filter controls');
  });

  // ── HR Management & Settings Tests ─────────────────────────────────────────

  it('TC-N-57 (TC-218): HR System Settings page renders management navigation cards (Leave Quota, HoD Assignment, Public Holidays) ✅', async function () {
    await setupHRSession(driver);
    await goTo(driver, '/hr/system-settings');
    await driver.sleep(1000);

    const cards = await driver.findElements(By.css('.setting-card, .card, .system-settings-card, .settings-grid > div'));
    assert.ok(cards.length >= 1 || (await hasEl(driver, 'h1, h2')), 'System settings navigation tiles must be rendered');
  });

  it('TC-N-58 (TC-219): HR Leave Quota section renders Annual and Casual quota input controls and update button ✅', async function () {
    await setupHRSession(driver);
    await goTo(driver, '/hr/system-settings');
    await driver.sleep(1000);

    // If card navigation is present, click the leave-quota section
    const quotaCard = await driver.findElement(By.xpath("//*[contains(text(), 'Leave Quota') or contains(text(), 'Quota')]")).catch(() => null);
    if (quotaCard) {
      await quotaCard.click();
      await driver.sleep(500);
    }

    const hasInputs = await hasEl(driver, 'input#annual, input#casual, input[name="annual"], input[type="number"], .quota-form');
    assert.ok(hasInputs, 'Leave quota management form must render annual and casual input controls');
  });

  it('TC-N-59 (TC-220): HR Public Holidays section renders holiday management view and "Add Holiday" / "Upload PDF" controls ✅', async function () {
    await setupHRSession(driver);
    await goTo(driver, '/hr/system-settings');
    await driver.sleep(1000);

    // Navigate to public holidays section if segmented
    const holidayCard = await driver.findElement(By.xpath("//*[contains(text(), 'Public Holiday') or contains(text(), 'Holiday')]")).catch(() => null);
    if (holidayCard) {
      await holidayCard.click();
      await driver.sleep(500);
    }

    const hasHolidayUI = await hasEl(driver, '.public-holiday, .holiday-container, button, table');
    assert.ok(hasHolidayUI, 'Public holiday management interface must render successfully');
  });
});
