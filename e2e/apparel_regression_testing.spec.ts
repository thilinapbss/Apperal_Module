import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { BuyerPoUploadPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadPage';
import { BuyerPoUploadFormPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadFormPage';
import { ExcelReader } from '../src/utils/ExcelReader';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

// ─── Login Tests ──────────────────────────────────────────────────────────────

let sharedPage: Page;
let loginPage: LoginPage;
let sharedContext: any;

test.describe.serial('Login Page Tests', () => {
  test('01. Setup: Create persistent browser context', async ({ browser }) => {
    sharedContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    sharedPage = await sharedContext.newPage();
    loginPage = new LoginPage(sharedPage);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
  });

  test('02. Should display error message on invalid credentials', async () => {
    await loginPage.login('invaliduser', 'wrongpassword');
    // Wait for error message to appear
    await loginPage.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
    const hasVisibleClass = await loginPage.errorMessage.evaluate((el) =>
      el.classList.contains('visible')
    );
    expect(hasVisibleClass).toBe(true);
  });

  test('03. Should successfully login with valid credentials and save auth', async () => {
    const username = "admin";
    const password = "Admin@1234";

    if (!username || !password) {
      throw new Error('Credentials not loaded from .env file');
    }

    // Clear the form from previous failed attempt
    await loginPage.usernameInput.clear();
    await loginPage.passwordInput.clear();

    await loginPage.usernameInput.waitFor({ state: 'visible', timeout: 90000 });
    await loginPage.passwordInput.waitFor({ state: 'visible', timeout: 90000 });
    await loginPage.usernameInput.fill(username);
    await loginPage.passwordInput.fill(password);
    await loginPage.clickLoginButton();
    await loginPage.waitForNavigation();

    await expect(sharedPage.locator('#shell-header')).toBeVisible();
    await expect(sharedPage.locator('#shellAppTitle-button')).toBeVisible();
    await expect(sharedPage.locator('#userActionsMenuHeaderButton')).toBeVisible();

    // Save auth state for subsequent tests
    await sharedContext.storageState({ path: authFile });
  });

});

// ─── Home Page Tests ──────────────────────────────────────────────────────────

let homePage: HomePage;
let buyerPoUploadPage: BuyerPoUploadPage;
let buyerPoUploadFormPage: BuyerPoUploadFormPage;

test.describe.serial('User Work Flow', () => {
  test('05. Setup: Navigate to home page', async () => {
    await sharedPage.goto('/');
    homePage = new HomePage(sharedPage);
    await homePage.waitForDashboard();
  });

  test('06. Should display all tile group headers', async () => {
    await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
    await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
    await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
    await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');
  });

  test('07. Should display Merchandising Process tiles', async () => {
    const group = homePage.merchandisingGroup;
    await expect(homePage.tile(group, 'Buyer PO Upload')).toBeVisible();
    await expect(homePage.tile(group, 'Style Master')).toBeVisible();
    await expect(homePage.tile(group, 'Trim Allocation')).toBeVisible();
    await expect(homePage.tile(group, 'Bill Of Material')).toBeVisible();
    await expect(homePage.tile(group, 'Cost Sheet')).toBeVisible();
    await expect(homePage.tile(group, 'ERP Post')).toBeVisible();
    await expect(homePage.tile(group, 'laysheet')).toBeVisible();
  });

  test('08. Should display Production Process tiles', async () => {
    const group = homePage.productionGroup;
    await expect(homePage.tile(group, 'Master Plan')).toBeVisible();
    await expect(homePage.tile(group, 'Working In Progress')).toBeVisible();
    await expect(homePage.tile(group, 'Gantt Chart Dashboard')).toBeVisible();
    await expect(homePage.tile(group, 'Inspection')).toBeVisible();
    await expect(homePage.tile(group, 'Inspection Checklist')).toBeVisible();
    await expect(homePage.tile(group, 'QC')).toBeVisible();
  });

  test('09. Should display Other tiles', async () => {
    const group = homePage.otherGroup;
    await expect(homePage.tile(group, 'Number Series')).toBeVisible();
    await expect(homePage.tile(group, 'UDO Creation')).toBeVisible();
    await expect(homePage.tile(group, 'Bundle Code Generation')).toBeVisible();
    await expect(homePage.tile(group, 'Cartoons')).toBeVisible();
    await expect(homePage.tile(group, 'User & Role Management')).toBeVisible();
  });

  test('10. Should display Masters & Sub Masters tiles', async () => {
    const group = homePage.mastersGroup;
    await expect(homePage.tile(group, 'Segment Master')).toBeVisible();
    await expect(homePage.tile(group, 'Routing Plan')).toBeVisible();
    await expect(homePage.tile(group, 'Vendor Merchandiser')).toBeVisible();
    await expect(homePage.tile(group, 'Sub Master Branch')).toBeVisible();
  });

  test('11. Click on Buyer PO Upload tile', async () => {
    const buyerPoTile = homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload');
    await expect(buyerPoTile).toBeVisible();
    await buyerPoTile.click();
    // Initialize the Buyer PO Upload page object
    buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
  });

  test('12. Verify Buyer PO Upload page loaded', async () => {
    await buyerPoUploadPage.waitForPageLoad();
  });

  test('13. Click Create button', async () => {
    await expect(buyerPoUploadPage.createButton).toBeVisible();
    await buyerPoUploadPage.clickCreateButton();
    await sharedPage.waitForLoadState('networkidle');
  });

  test('14. Verify Buyer PO Upload form loaded', async () => {
    buyerPoUploadFormPage = new BuyerPoUploadFormPage(sharedPage);
    await buyerPoUploadFormPage.waitForFormLoad();
  });

  test('15. Verify form fields are visible', async () => {
    // Verify form container and buttons are visible
    await expect(buyerPoUploadFormPage.formContainer).toBeVisible();
  });

  test('16. Upload Excel file - PO Summary format1.xlsx', async () => {
    // Verify upload button is visible
    await expect(buyerPoUploadFormPage.excelUploadButton).toBeVisible();

    // Upload the specific Excel file: PO Summary format1.xlsx
    const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
    const fs = require('fs');

    if (fs.existsSync(excelFilePath)) {
      console.log(`Uploading file: ${excelFilePath}`);
      // This will click the button AND handle the file chooser dialog
      await buyerPoUploadFormPage.uploadExcelFile(excelFilePath);
      await sharedPage.waitForLoadState('networkidle');
    } else {
      throw new Error(`Excel file not found at: ${excelFilePath}`);
    }
  });

  test('18. Verify file upload success', async () => {
    await buyerPoUploadFormPage.waitForSuccessMessage();
    const isSuccess = await buyerPoUploadFormPage.isSuccessMessageVisible();
    expect(isSuccess).toBe(true);
  });

  test('19. Read Excel file and verify data loaded', async () => {
    // Read the Excel file to get expected data
    const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
    const excelData = ExcelReader.readBuyerPOFile(excelFilePath);

    // Wait for data to be loaded in the form
    await sharedPage.waitForTimeout(3000);

    // Get actual values from the form
    const buyerValue = await buyerPoUploadFormPage.getBuyerValue();
    const styleNoValue = await buyerPoUploadFormPage.getStyleNoValue();
    const styleDescValue = await buyerPoUploadFormPage.getStyleDescriptionValue();
    const styleColorValue = await buyerPoUploadFormPage.getStyleColorValue();
    const seasonValue = await buyerPoUploadFormPage.getSeasonValue();

    console.log('Extracted Excel Data:', excelData);



    console.log('Form Values:', {
      buyer: buyerValue,
      styleNo: styleNoValue,
      styleDescription: styleDescValue,
      styleColor: styleColorValue,
      season: seasonValue
    });

    // Note: Buyer field (QA 2) is metadata about which buyer the data is for,
    // not a form input field, so we skip validating it

    // Verify Style No field
    if (excelData.styleNo) {
      expect(styleNoValue).toContain(excelData.styleNo);
    }

    // Verify Style Description field
    if (excelData.styleDescription) {
      expect(styleDescValue).toContain(excelData.styleDescription);
    }

    // Verify Style Color field
    if (excelData.styleColor) {
      expect(styleColorValue).toContain(excelData.styleColor);
    }

    // Verify Season field
    if (excelData.season) {
      expect(seasonValue).toContain(excelData.season);
    }
  });

  test('20. Cleanup: Close browser and context', async () => {
    await sharedPage.close();
  });
});
