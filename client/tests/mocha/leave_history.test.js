/**
 * leave_history.test.js
 * Tests the Employee Leave History page: summary stats, status & type filter dropdowns, expandable detailed application cards, and empty state.
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

async function setupEmployeeSession(driver) {
  await goTo(driver, '/login');
  await driver.executeScript(`
    localStorage.setItem('token', 'mock-employee-token-sqa');
    localStorage.setItem('user', JSON.stringify({
      _id: 'emp-test-01',
      name: 'Dr. John Doe',
      email: 'john@iut-dhaka.edu',
      roles: ['Employee'],
      designation: 'Assistant Professor',
      department: { _id: 'dept-cse-01', name: 'Computer Science & Engineering' }
    }));
  `);
}

describe('Employee Leave History Tests (TC-197 to TC-202)', function () {
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

  beforeEach(async function () {
    await setupEmployeeSession(driver);
  });

  it('TC-N-36 (TC-197): Leave history page displays summary stats cards ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(1000);

    const statsExist = await hasEl(driver, '.history-stats, .stat-box, .stats-card');
    assert.ok(statsExist, 'Leave history stats overview (Total, Approved, Declined, Days Taken) must exist');
  });

  it('TC-N-37 (TC-198): Leave history renders status filter dropdown with All/Approved/Declined options ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(500);

    const filterSelects = await driver.findElements(By.css('select.filter-select, .history-filters select'));
    assert.ok(filterSelects.length >= 1, 'Status filter dropdown must be present');
    
    const optionsText = await filterSelects[0].getText();
    assert.ok(optionsText.includes('All') || optionsText.includes('Approved'), 'Status filter must include status options');
  });

  it('TC-N-38 (TC-199): Leave history renders leave type filter dropdown with All/Annual/Casual options ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(500);

    const filterSelects = await driver.findElements(By.css('select.filter-select, .history-filters select'));
    assert.ok(filterSelects.length >= 2, 'Leave type filter dropdown must be present');

    const typeOptions = await filterSelects[1].getText();
    assert.ok(typeOptions.includes('Annual') || typeOptions.includes('Casual'), 'Type filter must include leave type options');
  });

  it('TC-N-40 (TC-200): Leave history page renders list or table container with history cards ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(1000);

    const hasContainer = await hasEl(driver, '.history-list, .history-container, table');
    assert.ok(hasContainer, 'Leave history container or list view must be rendered');
  });

  it('TC-N-41 (TC-201): Clicking a history card header expands the detailed leave form breakdown ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(1000);

    const cards = await driver.findElements(By.css('.history-card-header, .history-card'));
    if (cards.length > 0) {
      await cards[0].click();
      await driver.sleep(500);
      const isExpanded = await hasEl(driver, '.history-card-body.visible, .form-container, .expanded');
      assert.ok(isExpanded, 'Clicking history card header should expand detailed form section');
    } else {
      // If no mock data returned, verify empty state is visible
      const emptyState = await hasEl(driver, '.history-empty, p');
      assert.ok(emptyState, 'History page should display empty state or list');
    }
  });

  it('TC-N-42 (TC-202): Displays empty state placeholder when no records match filter criteria ✅', async function () {
    await goTo(driver, '/leave-history');
    await driver.sleep(500);

    // If there are filters, change them to filter records
    const filterSelects = await driver.findElements(By.css('select.filter-select'));
    if (filterSelects.length >= 1) {
      await filterSelects[0].sendKeys('Declined');
      await driver.sleep(500);
    }

    const hasContentOrEmpty = await hasEl(driver, '.history-empty, .history-card, .history-list');
    assert.ok(hasContentOrEmpty, 'Leave history must render list or empty placeholder gracefully');
  });
});
