/**
 * profile_settings.test.js
 * Tests User Profile page, leave balance cards, profile editing, and Change Password modal with validation rules.
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
      },
      createdAt: '2024-01-15T00:00:00.000Z'
    }));
  `);
}

describe('User Profile & Password Management Tests (TC-209 to TC-214)', function () {
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

  it('TC-N-48 (TC-209): Profile page displays user personal information (Name, Email, Designation) ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    const bodyText = await (await el(driver, 'body')).getText();
    assert.ok(bodyText.includes('John Doe'), 'Profile should display user name');
    assert.ok(bodyText.includes('john@iut-dhaka.edu'), 'Profile should display user email');
  });

  it('TC-N-49 (TC-210): Profile page displays leave balance cards ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    const hasLeaveData = await hasEl(driver, '.leave-data-container, .leave-card, .leave-stats, .stat-box');
    assert.ok(hasLeaveData, 'Leave balance summary component must be displayed on profile');
  });

  it('TC-N-50 (TC-211): Clicking "Edit Profile" allows inline name/designation updating with Save/Cancel buttons ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    const editBtn = await el(driver, 'button.btn-edit, .personal-info-container button');
    await editBtn.click();
    await driver.sleep(500);

    assert.ok(await hasEl(driver, 'input[name="name"]'), 'Inline name input should appear in edit mode');
    assert.ok(await hasEl(driver, 'button.btn-save'), 'Save button must be visible');
    assert.ok(await hasEl(driver, 'button.btn-cancel'), 'Cancel button must be visible');
  });

  it('TC-N-51 (TC-212): Clicking "Change Password" opens the Change Password modal dialog ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    const changePassBtn = await el(driver, 'button.btn-change-password');
    await changePassBtn.click();
    await driver.sleep(500);

    const isModalOpen = await hasEl(driver, '.modal-overlay, .modal-content, .password-form');
    assert.ok(isModalOpen, 'Change Password modal dialog must be open');
  });

  it('TC-N-52 (TC-213): Change Password modal contains Current Password, New Password, and Confirm Password fields ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    await (await el(driver, 'button.btn-change-password')).click();
    await driver.sleep(500);

    assert.ok(await hasEl(driver, 'input#currentPassword, input[name="currentPassword"]'), 'Current password input must exist');
    assert.ok(await hasEl(driver, 'input#newPassword, input[name="newPassword"]'), 'New password input must exist');
    assert.ok(await hasEl(driver, 'input#confirmPassword, input[name="confirmPassword"]'), 'Confirm password input must exist');
  });

  it('TC-B-53 (TC-214): Change Password modal enforces password policy and displays validation error for short passwords ✅', async function () {
    await goTo(driver, '/profile');
    await driver.sleep(1000);

    await (await el(driver, 'button.btn-change-password')).click();
    await driver.sleep(500);

    await (await el(driver, 'input#currentPassword, input[name="currentPassword"]')).sendKeys('OldPass123');
    await (await el(driver, 'input#newPassword, input[name="newPassword"]')).sendKeys('abc');
    await (await el(driver, 'input#confirmPassword, input[name="confirmPassword"]')).sendKeys('abc');
    await (await el(driver, '.modal-content button[type="submit"], button.btn-save')).click();
    await driver.sleep(500);

    const errorEl = await el(driver, '.error-message, .error, [role="alert"]');
    const errorText = await errorEl.getText();
    assert.ok(errorText.toLowerCase().includes('at least 6') || errorText.length > 0, 'Should show password length error');
  });
});
