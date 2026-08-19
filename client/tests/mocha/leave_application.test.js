/**
 * leave_application.test.js
 * Tests the Employee Leave Application form: inputs, purpose toggles, date calculation, reset actions, and date validation bugs.
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
      department: { _id: 'dept-cse-01', name: 'Computer Science & Engineering' },
      leaveQuota: {
        annual: { allocated: 20, used: 4 },
        casual: { allocated: 10, used: 2 }
      }
    }));
  `);
}

describe('Employee Leave Application Tests (TC-191 to TC-196)', function () {
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

  it('TC-N-30 (TC-191): Leave application form renders all mandatory input controls ✅', async function () {
    await goTo(driver, '/leave-application');
    
    // Check key form elements
    assert.ok(await hasEl(driver, 'select#type, select[name="type"]'), 'Leave type selector must exist');
    assert.ok(await hasEl(driver, 'input#startDate, input[name="startDate"]'), 'Start date input must exist');
    assert.ok(await hasEl(driver, 'input#endDate, input[name="endDate"]'), 'End date input must exist');
    assert.ok(await hasEl(driver, 'textarea#reason, textarea[name="reason"]'), 'Reason textarea must exist');
    assert.ok(await hasEl(driver, 'button[type="submit"]'), 'Submit button must exist');
  });

  it('TC-N-31 (TC-192): Selecting Annual leave type reveals predefined purpose checkboxes ✅', async function () {
    await goTo(driver, '/leave-application');
    const typeSelect = await el(driver, 'select#type, select[name="type"]');
    await typeSelect.sendKeys('Annual');
    await driver.sleep(500);

    const hasPurposes = await hasEl(driver, '.purpose-checkbox-group, input[type="checkbox"]');
    assert.ok(hasPurposes, 'Selecting Annual leave should reveal predefined purpose options (Medical/Conference/Personal)');
  });

  it('TC-N-32 (TC-193): Date pickers accept input and display calculated weekday count ✅', async function () {
    await goTo(driver, '/leave-application');
    const startDateInput = await el(driver, 'input#startDate, input[name="startDate"]');
    const endDateInput = await el(driver, 'input#endDate, input[name="endDate"]');
    
    await startDateInput.sendKeys('2026-09-07'); // Monday
    await endDateInput.sendKeys('2026-09-09');   // Wednesday
    await driver.sleep(500);

    const daysInput = await el(driver, 'input#numberOfDays, input[name="numberOfDays"]');
    const daysVal = await daysInput.getAttribute('value');
    assert.ok(daysVal !== '' && parseInt(daysVal, 10) >= 1, 'Calculated number of weekdays should be displayed');
  });

  it('TC-N-33 (TC-194): Selecting Medical/Conference purpose exposes document attachment section ✅', async function () {
    await goTo(driver, '/leave-application');
    const typeSelect = await el(driver, 'select#type, select[name="type"]');
    await typeSelect.sendKeys('Annual');
    await driver.sleep(500);

    // Look for Medical checkbox or file attachment area
    const checkboxes = await driver.findElements(By.css('.purpose-checkbox-item input[type="checkbox"]'));
    if (checkboxes.length > 0) {
      await checkboxes[0].click(); // Select first purpose (Medical)
      await driver.sleep(500);
    }
    
    assert.ok(await hasEl(driver, '.leave-document, input[type="file"], .document-upload'), 'Supporting document section must be present');
  });

  it('TC-N-34 (TC-195): "Clear" button resets all form inputs to default values ✅', async function () {
    await goTo(driver, '/leave-application');
    const reasonInput = await el(driver, 'textarea#reason, textarea[name="reason"]');
    await reasonInput.sendKeys('Attending annual educational symposium');
    
    const clearBtn = await el(driver, 'button.btn-secondary, button[type="button"]');
    await clearBtn.click();
    await driver.sleep(500);

    const clearedValue = await (await el(driver, 'textarea#reason, textarea[name="reason"]')).getAttribute('value');
    assert.strictEqual(clearedValue, '', 'Reason input should be empty after clicking Clear');
  });

  it('TC-B-35 (TC-196): End date earlier than start date displays validation error ❌ (Bug SQA-3: form allows reversed dates)', async function () {
    await goTo(driver, '/leave-application');
    const startDateInput = await el(driver, 'input#startDate, input[name="startDate"]');
    const endDateInput = await el(driver, 'input#endDate, input[name="endDate"]');
    
    await startDateInput.sendKeys('2026-09-15');
    await endDateInput.sendKeys('2026-09-10'); // Reversed date
    await (await el(driver, 'button[type="submit"]')).click();
    await driver.sleep(1500);

    const hasValidationError = await hasEl(driver, '.application-error, .error, .alert, [role="alert"]');
    // FAILS — Bug SQA-3 allows submission without client-side date order validation
    assert.ok(hasValidationError, 'Expected client-side validation error when end date is earlier than start date (Bug SQA-3)');
  });
});
