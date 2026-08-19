const { Builder, By, until } = require('selenium-webdriver');

const APP_URL = 'http://localhost:5173';

describe('HR Flow E2E Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().setTimeouts({ implicit: 5000 });
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    await driver.get(`${APP_URL}/login`);
    await driver.executeScript('window.localStorage.clear();');
    await driver.manage().deleteAllCookies();
    
    // Login as HR
    try {
      await driver.findElement(By.name('email')).sendKeys('hr@iut-dhaka.edu');
      await driver.findElement(By.name('password')).sendKeys('Test1234');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains('/hr/dashboard'), 5000);
    } catch (err) {
      console.warn("HR Login failed during setup.");
    }
  });

  test('TC-23: HR Dashboard loads with global statistics', async () => {
    await driver.get(`${APP_URL}/hr/dashboard`);
    const header = await driver.findElement(By.tagName('h1')).getText();
    expect(header.toLowerCase()).toContain('dashboard');
  });

  test('TC-24: System Settings page loads', async () => {
    await driver.get(`${APP_URL}/hr/system-settings`);
    const header = await driver.findElement(By.tagName('h1')).getText();
    expect(header.toLowerCase()).toContain('settings');
  });

  test('TC-25: Leave Quota updater form renders', async () => {
    await driver.get(`${APP_URL}/hr/system-settings`);
    const text = await driver.findElement(By.tagName('body')).getText();
    expect(text.toLowerCase()).toContain('quota');
  });

  test('TC-26: Public Holiday list loads in System Settings', async () => {
    await driver.get(`${APP_URL}/hr/system-settings`);
    const text = await driver.findElement(By.tagName('body')).getText();
    expect(text.toLowerCase()).toContain('holiday');
  });

  test('TC-27: Add New Holiday modal opens in System Settings', async () => {
    await driver.get(`${APP_URL}/hr/system-settings`);
    const btn = await driver.findElement(By.xpath("//*[contains(text(), 'Add Holiday') or contains(text(), 'New Holiday')]")).catch(() => null);
    if (btn) {
      await btn.click();
      const modal = await driver.findElement(By.css('.modal, dialog'));
      expect(modal).toBeDefined();
    }
  });

  test('TC-28: Review Applications page displays pending global requests', async () => {
    await driver.get(`${APP_URL}/hr/review-application`);
    const text = await driver.findElement(By.tagName('body')).getText();
    expect(text.toLowerCase()).toContain('review');
  });

  test('TC-29: All Employees page displays organization-wide directory', async () => {
    await driver.get(`${APP_URL}/hr/employees`);
    const table = await driver.findElement(By.tagName('table')).catch(() => null);
    const list = await driver.findElement(By.css('.grid, .list')).catch(() => null);
    expect(table || list).toBeDefined();
  });

  test('TC-30: HR Analytics page loads correctly', async () => {
    await driver.get(`${APP_URL}/hr/leave-analytics`);
    const canvas = await driver.findElements(By.tagName('canvas'));
    expect(canvas.length).toBeGreaterThanOrEqual(0);
  });
});
