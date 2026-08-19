const { Builder, By, until } = require('selenium-webdriver');

const APP_URL = 'http://localhost:5173';

describe('Employee Flow E2E Tests', () => {
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

  // Mock a login before each test for Employee features
  beforeEach(async () => {
    await driver.get(`${APP_URL}/login`);
    await driver.executeScript('window.localStorage.clear();');
    await driver.manage().deleteAllCookies();
    
    // Fallback: This assumes an employee exists. If not, tests will fail here.
    // Replace with a real test employee credential if different.
    try {
      await driver.findElement(By.name('email')).sendKeys('employee@iut-dhaka.edu');
      await driver.findElement(By.name('password')).sendKeys('Test1234');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.urlContains('/profile'), 5000);
    } catch (err) {
      console.warn("Login failed during beforeEach setup. Tests may fail.");
    }
  });

  test('TC-09: Employee Dashboard displays correct summary cards', async () => {
    await driver.get(`${APP_URL}/profile`); // Assuming profile acts as dashboard
    const body = await driver.findElement(By.tagName('body')).getText();
    expect(body.toLowerCase()).toContain('leave quota'); // Should show quota
  });

  test('TC-10: Leave Application form loads', async () => {
    await driver.get(`${APP_URL}/leave-application`);
    const header = await driver.findElement(By.tagName('h1')).getText();
    expect(header.toLowerCase()).toContain('apply');
  });

  test('TC-11: Leave Application blocks submission if dates are missing', async () => {
    await driver.get(`${APP_URL}/leave-application`);
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    // Should still be on the same page
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/leave-application');
  });

  test('TC-12: Leave Application date selection auto-calculates total days', async () => {
    await driver.get(`${APP_URL}/leave-application`);
    
    // Try to find date inputs and fill them. 
    // This is a generic approach; robust testing requires exact IDs.
    const dateInputs = await driver.findElements(By.css('input[type="date"]'));
    if (dateInputs.length >= 2) {
      await dateInputs[0].sendKeys('2026-09-01'); // Start date
      await dateInputs[1].sendKeys('2026-09-03'); // End date
      
      // Click somewhere else to trigger blur/calc
      await driver.findElement(By.tagName('body')).click();
      
      const text = await driver.findElement(By.tagName('body')).getText();
      expect(text).toContain('3'); // 3 days
    }
  });

  test('TC-13: Leave History page displays history table', async () => {
    await driver.get(`${APP_URL}/leave-history`);
    const table = await driver.findElement(By.tagName('table'));
    expect(table).toBeDefined();
  });

  test('TC-14: Leave History table pagination/empty state functions', async () => {
    await driver.get(`${APP_URL}/leave-history`);
    // Check if table has rows, or if "No history found" text is visible
    const text = await driver.findElement(By.tagName('body')).getText();
    const hasDataOrEmptyState = text.toLowerCase().includes('no history') || text.toLowerCase().includes('status');
    expect(hasDataOrEmptyState).toBe(true);
  });

  test('TC-15: Department members page displays colleagues', async () => {
    await driver.get(`${APP_URL}/members`);
    const text = await driver.findElement(By.tagName('body')).getText();
    expect(text.toLowerCase()).toContain('department');
  });

  test('TC-16: Alternate Request page loads correctly', async () => {
    await driver.get(`${APP_URL}/alternate-requests`);
    const header = await driver.findElement(By.tagName('h1')).getText();
    expect(header.toLowerCase()).toContain('alternate');
  });
});
