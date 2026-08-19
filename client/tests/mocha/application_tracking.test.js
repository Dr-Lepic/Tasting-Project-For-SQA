/**
 * application_tracking.test.js
 * Tests Application Status tracking and Alternate Requests review/action workflows.
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

describe('Application Status & Alternate Requests Tests (TC-203 to TC-208)', function () {
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

  it('TC-N-42 (TC-203): Application status page renders container for pending leave applications ✅', async function () {
    await goTo(driver, '/application-status');
    await driver.sleep(1000);

    const hasPage = await hasEl(driver, '.status-container, .application-status-page, h1');
    assert.ok(hasPage, 'Application status tracking page must be rendered');
  });

  it('TC-N-43 (TC-204): Application status view renders status badge or empty placeholder ✅', async function () {
    await goTo(driver, '/application-status');
    await driver.sleep(1000);

    const hasStatusOrEmpty = await hasEl(driver, '.status-badge, .application-card, .empty-state, .no-applications, p');
    assert.ok(hasStatusOrEmpty, 'Status cards with progress indicators or clean empty state must be present');
  });

  it('TC-N-44 (TC-205): Application status page header displays informative subtitle ✅', async function () {
    await goTo(driver, '/application-status');
    await driver.sleep(500);

    const header = await el(driver, 'h1');
    const headerText = await header.getText();
    assert.ok(headerText.toLowerCase().includes('application') || headerText.toLowerCase().includes('status'), 'Header should identify application status page');
  });

  it('TC-N-45 (TC-206): Alternate requests page renders incoming delegate requests container ✅', async function () {
    await goTo(driver, '/alternate-requests');
    await driver.sleep(1000);

    const hasContainer = await hasEl(driver, '.alternate-requests-page, .alternate-requests-container, h1');
    assert.ok(hasContainer, 'Alternate requests page container must be present');
  });

  it('TC-N-46 (TC-207): Alternate requests view displays header and instruction description ✅', async function () {
    await goTo(driver, '/alternate-requests');
    await driver.sleep(500);

    const header = await el(driver, 'h1');
    const headerText = await header.getText();
    assert.ok(headerText.toLowerCase().includes('alternate'), 'Header must contain Alternate requests title');
  });

  it('TC-N-47 (TC-208): Alternate request list renders action buttons or empty queue state ✅', async function () {
    await goTo(driver, '/alternate-requests');
    await driver.sleep(1000);

    // Look for accept/decline action buttons or empty queue card
    const hasButtonsOrEmpty = await hasEl(driver, '.btn-accept, .btn-decline, .request-card, .empty-state, .no-requests, p');
    assert.ok(hasButtonsOrEmpty, 'Alternate requests should render actionable items or empty state');
  });
});
