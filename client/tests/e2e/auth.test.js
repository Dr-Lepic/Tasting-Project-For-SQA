const { Builder, By, until } = require('selenium-webdriver');

const APP_URL = 'http://localhost:5173'; // Vite default

describe('Auth Flow E2E Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    // Implicit wait helps locate elements that might render slightly later
    await driver.manage().setTimeouts({ implicit: 5000 });
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    // Clear local storage and cookies before each test
    await driver.get(APP_URL);
    await driver.executeScript('window.localStorage.clear();');
    await driver.manage().deleteAllCookies();
  });

  test('TC-01: Valid Login redirects to dashboard', async () => {
    await driver.get(`${APP_URL}/login`);
    
    await driver.findElement(By.name('email')).sendKeys('test@iut-dhaka.edu');
    await driver.findElement(By.name('password')).sendKeys('Test1234');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Check if URL changed, meaning successful login redirect
    await driver.wait(until.urlContains('/profile'), 5000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/profile'); // or whatever the default route is
  });

  test('TC-02: Invalid Login shows error message', async () => {
    await driver.get(`${APP_URL}/login`);
    
    await driver.findElement(By.name('email')).sendKeys('wrong@iut-dhaka.edu');
    await driver.findElement(By.name('password')).sendKeys('wrongpassword');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Look for an error message or toast
    // This is a generic locator for an error alert; adjust if needed
    const errorAlert = await driver.findElement(By.css('.error, .alert, .toast'));
    const text = await errorAlert.getText();
    expect(text.length).toBeGreaterThan(0);
  });

  test('TC-03: Registration page UI loads', async () => {
    await driver.get(`${APP_URL}/register`);
    
    const header = await driver.findElement(By.tagName('h1')).getText();
    expect(header.toLowerCase()).toContain('register');
  });

  test('TC-04: Registration form validation blocks submission on empty fields', async () => {
    await driver.get(`${APP_URL}/register`);
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    // HTML5 validation or JS validation should prevent URL change
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  test('TC-05: Registration form validates password mismatch', async () => {
    await driver.get(`${APP_URL}/register`);
    
    await driver.findElement(By.name('password')).sendKeys('Test1234');
    // Assuming the confirm password field is named 'confirmPassword'
    await driver.findElement(By.name('confirmPassword')).sendKeys('Test1235'); 
    await driver.findElement(By.css('button[type="submit"]')).click();

    const url = await driver.getCurrentUrl();
    expect(url).toContain('/register');
  });

  test('TC-06: Forgot Password page UI loads', async () => {
    await driver.get(`${APP_URL}/forgot-password`);
    
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    expect(bodyText.toLowerCase()).toContain('forgot password');
  });

  test('TC-07: Profile page loads for logged-in user', async () => {
    // Requires a mock login or real login first
    await driver.get(`${APP_URL}/login`);
    await driver.findElement(By.name('email')).sendKeys('test@iut-dhaka.edu');
    await driver.findElement(By.name('password')).sendKeys('Test1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/profile'), 5000);

    // Verify profile elements exist
    const profilePic = await driver.findElement(By.css('img')); // looking for avatar
    expect(profilePic).toBeDefined();
  });

  test('TC-08: Logout clears session and redirects to login', async () => {
    await driver.get(`${APP_URL}/login`);
    await driver.findElement(By.name('email')).sendKeys('test@iut-dhaka.edu');
    await driver.findElement(By.name('password')).sendKeys('Test1234');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/profile'), 5000);

    // Find and click logout button
    const logoutBtn = await driver.findElement(By.xpath("//*[contains(text(), 'Logout') or contains(text(), 'Sign out')]"));
    await logoutBtn.click();

    await driver.wait(until.urlContains('/login'), 5000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/login');
  });
});
