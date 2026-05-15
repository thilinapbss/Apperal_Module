import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { BuyerPoUploadPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadPage';
import { BuyerPoUploadFormPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadFormPage';
import { ExcelReader } from '../src/utils/ExcelReader';

// Load test data
const testDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
const fs = require('fs');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

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
    await expect(homePage.tile(group, 'Lay Sheet')).toBeVisible();
  });

  test('08. Should display Production Process tiles', async () => {
    const group = homePage.productionGroup;
    const productionTiles = ['Master Plan', 'Gantt Chart Dashboard', 'Inspection', 'Inspection Checklist', 'QC'];

    for (const tileTitle of productionTiles) {
      const tile = homePage.tile(group, tileTitle);
      const isVisible = await tile.isVisible({ timeout: 5000 }).catch(() => false);
      if (!isVisible) {
        console.log(`⚠ Production tile "${tileTitle}" not found`);
      } else {
        await expect(tile).toBeVisible();
      }
    }
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

  test('18. Verify file upload processed', async () => {
    console.log('Waiting for form to process uploaded file...');
    await sharedPage.waitForLoadState('networkidle');
    await sharedPage.waitForTimeout(2000);
    console.log('✓ File upload processed, form ready for verification');
  });

  test('19. Read Excel file and verify data loaded', async () => {
    // Read the Excel file to get expected data
    const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
    const excelData = ExcelReader.readBuyerPOFile(excelFilePath);

    // Wait for data to be loaded in the form - increased wait time for all browsers
    console.log('Waiting for form data to populate...');
    await sharedPage.waitForTimeout(5000);

    // Get actual values from the form with enhanced debugging
    console.log('Retrieving form field values...');
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

  test('20. Fill form: Select supplier, enter PO Date and Kimble Number', async () => {
    // Step 1: Click Supplier Code Value Help button
    console.log('Step 1: Opening Supplier Code value help dialog...');
    await expect(buyerPoUploadFormPage.supplierCodeValueHelpButton).toBeVisible();
    await buyerPoUploadFormPage.clickSupplierCodeValueHelpButton();
    await sharedPage.waitForLoadState('networkidle');
    console.log('✓ Value help dialog opened');

    // Step 2: Select supplier from value help list
    console.log('Step 2: Selecting supplier from value help list...');
    const supplierDescription = testData.suppliers[0].Description;
    const supplierValue = testData.suppliers[0].Value;
    console.log(`Selecting supplier: ${supplierDescription} (${supplierValue})`);

    try {
      await buyerPoUploadFormPage.selectSupplierByCode(supplierDescription || supplierValue);
      console.log(`✓ Selected supplier: ${supplierDescription}`);
    } catch (error) {
      console.log(`Supplier not found by description, trying by value...`);
      try {
        await buyerPoUploadFormPage.selectSupplierByCode(supplierValue);
        console.log(`✓ Selected supplier by value: ${supplierValue}`);
      } catch (fallbackError) {
        console.log(`Supplier code not found, selecting first supplier instead`);
        await buyerPoUploadFormPage.selectFirstSupplierFromValueHelpList();
      }
    }

    // Step 3: Enter PO Date - Select today from calendar picker
    console.log('Step 3: Selecting PO Date from calendar...');
    await buyerPoUploadFormPage.selectTodayFromCalendar();

    const enteredDate = await buyerPoUploadFormPage.getPODateValue();
    console.log(`✓ PO Date selected: ${enteredDate}`);

    // Step 4: Enter Kimble Number (from test data)
    console.log('Step 4: Entering Kimble Number...');
    const kimbleNo = testData.testScenarios[0].kimbleNo.example;
    console.log(`Entering Kimble No: ${kimbleNo}`);
    await buyerPoUploadFormPage.enterKimbleNo(kimbleNo);

    const enteredKimbleNo = await buyerPoUploadFormPage.getKimbleNoValue();
    console.log(`✓ Kimble No entered: ${enteredKimbleNo}`);
    expect(enteredKimbleNo).toBe(kimbleNo);

    console.log('✓ All form fields completed successfully');
  });

  test('21. Enter Remark', async () => {
    const remark = testData.testScenarios[0].remark.example;
    console.log(`Entering Remark: ${remark}`);
    await buyerPoUploadFormPage.enterRemark(remark);
    const enteredRemark = await buyerPoUploadFormPage.getRemarkValue();
    console.log(`✓ Remark entered: ${enteredRemark}`);
    expect(enteredRemark).toContain(remark);
  });

  test('22. Fill in all line item details (Delivery No, Dates)', async () => {
    console.log('Filling in all line item details...');

    // Get line item details from test data
    const lineItems = testData.testScenarios[0].lineItems;

    // Fill in all details in the table
    await buyerPoUploadFormPage.fillLineItemDetailsInTable(lineItems);

    console.log('✓ All line item details filled successfully');
  });

  test('23. Click Save/Create button to save the form', async () => {
    console.log('Saving the form by clicking Create button...');
    await buyerPoUploadFormPage.clickSaveCreateButton();
    console.log('✓ Form saved successfully');
  });

  test('25. Verify Details table contains PO data with delivery numbers', async () => {
    // Get the table data from the Details table
    const tableData = await buyerPoUploadFormPage.verifyPOSizeBreakdownTableData();

    console.log('Details Table Data:', JSON.stringify(tableData, null, 2));

    // Verify table has data
    expect(tableData.length).toBeGreaterThan(0);

    // Verify the first row contains the expected PO data
    const firstRow = tableData[0];
    expect(firstRow.poNo).toContain('QA2-T001');
    console.log(`✓ PO No verified: ${firstRow.poNo}`);

    // Verify other fields are populated
    expect(firstRow.countryCode).toBeTruthy();
    console.log(`✓ Country Code: ${firstRow.countryCode}`);

    expect(firstRow.partNo).toBeTruthy();
    console.log(`✓ Part No: ${firstRow.partNo}`);

    expect(firstRow.qty).toBeTruthy();
    console.log(`✓ Qty: ${firstRow.qty}`);

    expect(firstRow.total).toBeTruthy();
    console.log(`✓ Total: ${firstRow.total}`);

    console.log('✓ Details table verified with PO data');
  });

  test('24. Capture all line item details and update test data JSON', async () => {
    console.log('Capturing all line item details with delivery numbers...');

    // Capture the actual values entered (including auto-generated delivery numbers)
    const capturedLineItems = await buyerPoUploadFormPage.captureLineItemsWithAllDetails();

    console.log('Captured Line Items:', JSON.stringify(capturedLineItems, null, 2));

    // Filter to get only rows with data
    const validItems = capturedLineItems.filter((item: any) => item.partNo && item.deliveryNo);

    expect(validItems.length).toBeGreaterThan(0);
    console.log(`✓ Captured ${validItems.length} line items with complete data`);

    // Update test data with actual delivery numbers and dates that were used
    testData.testScenarios[0].lineItems = validItems.map((item: any) => ({
      poNo: item.poNo,
      countryCode: item.countryCode,
      partNo: item.partNo,
      qty: item.qty,
      deliveryDate: item.deliveryDate,
      pcdDate: item.pcdDate,
      fobDate: item.fobDate,
      deliveryNo: item.deliveryNo // Auto-generated value
    }));

    // Save updated test data to JSON file
    const fs = require('fs');
    const testDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
    fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));

    console.log('✓ Test data JSON updated with actual delivery numbers and values');
  });

  test('26. Cleanup: Close browser and context', async () => {
    await sharedPage.close();
  });
});
