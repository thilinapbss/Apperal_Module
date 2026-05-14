import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// ─── Login Tests ──────────────────────────────────────────────────────────────

test.describe('Login Page Tests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
  });

  test('Should display error message on invalid credentials', async () => {
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
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error('Credentials not loaded from .env file');
    }

    await loginPage.usernameInput.waitFor({ state: 'visible', timeout: 90000 });
    await loginPage.passwordInput.waitFor({ state: 'visible', timeout: 90000 });
    await loginPage.usernameInput.fill(username);
    await loginPage.passwordInput.fill(password);
    await loginPage.clickLoginButton();
    await loginPage.waitForNavigation();

    await expect(page.locator('#shell-header')).toBeVisible();
    await expect(page.locator('#shellAppTitle-button')).toBeVisible();
    await expect(page.locator('#userActionsMenuHeaderButton')).toBeVisible();
  });
});

// ─── Home Page Tests ──────────────────────────────────────────────────────────

test.describe('Home Page - Dashboard Tiles', () => {
  let homePage: HomePage;
  let sharedPage: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: authFile });
    sharedPage = await context.newPage();
    await sharedPage.goto('/');
    homePage = new HomePage(sharedPage);
    await homePage.waitForDashboard();
  });

  test.afterAll(async () => {
    await sharedPage.close();
  });

  test('Should display all tile group headers', async () => {
    await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
    await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
    await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
    await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');
  });

  test('Should display Merchandising Process tiles', async () => {
    const group = homePage.merchandisingGroup;
    await expect(homePage.tile(group, 'Buyer PO Upload')).toBeVisible();
    await expect(homePage.tile(group, 'Style Master')).toBeVisible();
    await expect(homePage.tile(group, 'Trim Allocation')).toBeVisible();
    await expect(homePage.tile(group, 'Bill Of Material')).toBeVisible();
    await expect(homePage.tile(group, 'Cost Sheet')).toBeVisible();
    await expect(homePage.tile(group, 'ERP Post')).toBeVisible();
    await expect(homePage.tile(group, 'laysheet')).toBeVisible();
  });

  test('Should display Production Process tiles', async () => {
    const group = homePage.productionGroup;
    await expect(homePage.tile(group, 'Master Plan')).toBeVisible();
    await expect(homePage.tile(group, 'Working In Progress')).toBeVisible();
    await expect(homePage.tile(group, 'Gantt Chart Dashboard')).toBeVisible();
    await expect(homePage.tile(group, 'Inspection')).toBeVisible();
    await expect(homePage.tile(group, 'Inspection Checklist')).toBeVisible();
    await expect(homePage.tile(group, 'QC')).toBeVisible();
  });

  test('Should display Other tiles', async () => {
    const group = homePage.otherGroup;
    await expect(homePage.tile(group, 'Number Series')).toBeVisible();
    await expect(homePage.tile(group, 'UDO Creation')).toBeVisible();
    await expect(homePage.tile(group, 'Bundle Code Generation')).toBeVisible();
    await expect(homePage.tile(group, 'Cartoons')).toBeVisible();
    await expect(homePage.tile(group, 'User & Role Management')).toBeVisible();
  });

  test('Should display Masters & Sub Masters tiles', async () => {
    const group = homePage.mastersGroup;
    await expect(homePage.tile(group, 'Segment Master')).toBeVisible();
    await expect(homePage.tile(group, 'Routing Plan')).toBeVisible();
    await expect(homePage.tile(group, 'Vendor Merchandiser')).toBeVisible();
    await expect(homePage.tile(group, 'Sub Master Branch')).toBeVisible();
  });
});
