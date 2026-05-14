import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
  });

  test('Should display error message on invalid credentials', async () => {
    // Attempt login with invalid credentials
    await loginPage.login('invaliduser', 'wrongpassword');
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
    const hasVisibleClass = await loginPage.errorMessage.evaluate((el) => 
      el.classList.contains('visible')
    );
    expect(hasVisibleClass).toBe(true);
  });

  test('Should successfully login with valid credentials', async ({ page }) => {
    // Get credentials from environment variables
    const username = "admin";
    const password = "Admin@1234";
    
    // Log credentials for debugging
    console.log('Environment Variables - Username:', username, 'Password:', password);
    
    // Verify credentials are loaded
    if (!username || !password) {
      throw new Error('Credentials not loaded from .env file');
    }
    
    // Wait for input fields to be visible and ready
    await loginPage.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await loginPage.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Enter credentials with small delay
    await loginPage.usernameInput.fill(username);
    console.log('Entered username:', username);
    
    await loginPage.passwordInput.fill(password);
    console.log('Entered password:', password);
    
    // Verify values are in the fields
    const usernameValue = await loginPage.usernameInput.inputValue();
    const passwordValue = await loginPage.passwordInput.inputValue();
    console.log('Verified - Username field:', usernameValue, 'Password field:', passwordValue);
    
    // Click login button
    await loginPage.clickLoginButton();
    
    // Wait for navigation and dashboard to load
    await loginPage.waitForNavigation();
    await page.waitForTimeout(2000);
    
    // Verify successful login by checking for dashboard elements
    const shellLayout = page.locator('#shellLayout');
    const dashboardView = page.locator('.sapUshellDashboardView');
    const shellHeader = page.locator('#shell-header');
    
    // Verify all key elements are visible
    await expect(shellLayout).toBeVisible();
    await expect(dashboardView).toBeVisible();
    await expect(shellHeader).toBeVisible();

    // Verify dashboard tiles are loaded
    const tiles = page.locator('.sapUshellTile');
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);
  });
});

