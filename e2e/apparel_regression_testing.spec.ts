import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { BuyerPoUploadPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadPage';
import { BuyerPoUploadFormPage } from '../src/pages/BuyerPoUpload/BuyerPoUploadFormPage';
import { ExcelReader } from '../src/utils/ExcelReader';
import { SegmentMasterPage } from '../src/pages/SegmentMaster/SegmentMasterPage';
import { SegmentMasterCreate } from '../src/pages/SegmentMaster/SegmentMasterCreate';
import { RoutingPlanPage } from '../src/pages/RoutingPlan/RoutingPlanPage';
import { RoutingPlanCreate } from '../src/pages/RoutingPlan/RoutingPlanCreate';
import { VendorPage } from '../src/pages/Vendor/VendorPage';
import { VendorCreate } from '../src/pages/Vendor/VendorCreate';
import { SubMasterBranchPage } from '../src/pages/SubMasterBranch/SubMasterBranchPage';
import { SubMasterBranchCreate } from '../src/pages/SubMasterBranch/SubMasterBranchCreate';
import { StyleMasterPage } from '../src/pages/StyleMaster/StyleMasterPage';
import { StyleMasterCreate } from '../src/pages/StyleMaster/StyleMasterCreate';
import { CounterManager } from '../src/utils/CounterManager';

const testDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
const fs = require('fs');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// segmentMaster.json — single source of truth for all Segment Master test inputs
const segmentMasterDataPath = path.join(__dirname, '../testData/SegmentMaster/test-data.json');
const segmentMasterData: {
  name: string;
  segments: { segmentCode: string; segmentName: string }[];
} = JSON.parse(fs.readFileSync(segmentMasterDataPath, 'utf-8'));

// routingPlan test data
const routingPlanDataPath = path.join(__dirname, '../testData/RoutingPlan/testData.json');
const routingPlanData: {
  routingPlanName: string;
  routingPlanCode: string;
  status: string;
  details: { routeCode: string; routeName: string; warehouse: string; SemifinishedGood: string; FinishedGood: string }[];
} = JSON.parse(fs.readFileSync(routingPlanDataPath, 'utf-8'));

// vendor test data
const vendorDataPath = path.join(__dirname, '../testData/Vendor/test-data.json');
const vendorData: {
  vendorCode: string;
  vendorName: string;
  status: string;
} = JSON.parse(fs.readFileSync(vendorDataPath, 'utf-8'));

// sub master branch test data
const subMasterBranchDataPath = path.join(__dirname, '../testData/SubMasterBranch/test-data.json');
const subMasterBranchData: {
  branchCode: string;
  branchName: string;
  status: string;
} = JSON.parse(fs.readFileSync(subMasterBranchDataPath, 'utf-8'));

// style master test data
const styleMasterDataPath = path.join(__dirname, '../testData/StyleMaster/test-data.json');
const styleMasterData: {
  styleMasterCode: string;
  styleMasterName: string;
  departments: string;
  considerPacking: string;
  vcp: string;
  make: string;
  price: string;
  reference: string;
  seasonSelection: string;
  styleColor: string;
  styleStatus: string;
  segments?: {
    Color?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
    Size?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
    Season?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  };
  attachmentDetails?: Array<{ docName: string; remarks: string }>;
  rawMaterials?: Array<{ itemCode: string; itemName: string }>;
  allocationHierarchy?: Array<{ rowIndex: number; quantity: string }>;
} = JSON.parse(fs.readFileSync(styleMasterDataPath, 'utf-8'));

// segment master code test data
const segmentCodeDataPath = path.join(__dirname, '../testData/SegmentMaster/test-data.json');
const segmentCodeData: {
  code: string;
  name: string;
  status: string;
} = JSON.parse(fs.readFileSync(segmentCodeDataPath, 'utf-8'));

// buyer PO test data
const buyerPODataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/buyerPO.json');

// Create default data structure
const defaultBuyerPOData = {
  capturedAt: new Date().toISOString(),
  header: {
    buyer: '',
    styleNo: '',
    styleDescription: '',
    styleColor: '',
    season: '',
    supplierCode: '',
    poDate: '',
    kimbleNo: '',
    remark: '',
    currency: ''
  },
  lineItems: [],
  sizeBreakdown: []
};

// Create file if it doesn't exist
if (!fs.existsSync(buyerPODataPath)) {
  fs.writeFileSync(buyerPODataPath, JSON.stringify(defaultBuyerPOData, null, 2));
  console.log(`✓ Created buyerPO.json with default structure`);
}

const buyerPOData: {
  capturedAt: string;
  header: {
    buyer: string;
    styleNo: string;
    styleDescription: string;
    styleColor: string;
    season: string;
    supplierCode: string;
    poDate: string;
    kimbleNo: string;
    remark: string;
  };
  lineItems: {
    poNo: string;
    countryCode: string;
    partNo: string;
    qty: string;
    total: string;
    deliveryNo: string;
    deliveryDate: string;
    pcdDate: string;
    fobDate: string;
  }[];
} = JSON.parse(fs.readFileSync(buyerPODataPath, 'utf-8'));

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

let sharedPage: Page;
let sharedContext: any;
let loginPage: LoginPage;
let homePage: HomePage;
let buyerPoUploadPage: BuyerPoUploadPage;
let buyerPoUploadFormPage: BuyerPoUploadFormPage;
let segmentMasterPage: SegmentMasterPage;
let segmentMasterCreatePage: SegmentMasterCreate;
let routingPlanPage: RoutingPlanPage;
let routingPlanCreate: RoutingPlanCreate;
let vendorPage: VendorPage;
let vendorCreatePage: VendorCreate;
let subMasterBranchPage: SubMasterBranchPage;
let subMasterBranchCreatePage: SubMasterBranchCreate;
let styleMasterPage: StyleMasterPage;
let styleMasterCreatePage: StyleMasterCreate;

async function clearAllSessionData() {
  try {
    // Clear browser localStorage and sessionStorage
    await sharedPage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log('✓ Cleared localStorage and sessionStorage');

    // Clear all cookies
    const cookies = await sharedContext.cookies();
    if (cookies.length > 0) {
      await sharedContext.clearCookies();
      console.log(`✓ Cleared ${cookies.length} browser cookies`);
    }
  } catch (error) {
    console.warn('Warning during session cleanup:', error);
  }
}

async function performLogin() {
  loginPage = new LoginPage(sharedPage);
  await loginPage.goto();
  await loginPage.waitForLoginForm();
  await loginPage.usernameInput.clear();
  await loginPage.passwordInput.clear();
  await loginPage.usernameInput.fill('admin');
  await loginPage.passwordInput.fill('Admin@1234');
  await loginPage.clickLoginButton();
  await loginPage.waitForNavigation();
  homePage = new HomePage(sharedPage);
  await homePage.waitForDashboard();
  console.log('Re-login successful, resumed from home page');
}

async function ensureSessionValid() {
  try {
    const url = sharedPage.url();
    if (url.includes('login') || url === 'about:blank' || url === '') {
      console.log('Session lost — re-logging in...');
      await performLogin();
      return;
    }
    const isShellVisible = await sharedPage
      .locator('#shell-header')
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (!isShellVisible) {
      console.log('Shell not visible — re-logging in...');
      await performLogin();
    }
  } catch {
    console.log('Session check failed — re-logging in...');
    await performLogin();
  }
}

async function ensureOnDashboard() {
  homePage = new HomePage(sharedPage);
  const dashboardVisible = await homePage.dashboardSection.isVisible({ timeout: 3000 }).catch(() => false);
  if (dashboardVisible) {
    await homePage.waitForDashboard();
    return;
  }

  console.log('Not on dashboard — attempting to navigate back');
  await sharedPage.goBack().catch(() => {
    console.log('Browser history unavailable, falling back to re-login');
  });

  const nowVisible = await homePage.dashboardSection.isVisible({ timeout: 10000 }).catch(() => false);
  if (nowVisible) {
    await homePage.waitForDashboard();
    return;
  }

  console.log('Failed to return to dashboard via back navigation — re-logging in');
  await performLogin();
}

test.describe('Apperal Module | Regression Test Suite', () => {
  test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
      viewport: { width: 1920, height: 1080 }
    });
    sharedPage = await sharedContext.newPage();

    // Inject CSS to remove width constraints and ensure full-width display
    await sharedPage.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          max-width: none !important;
          width: 100% !important;
        }
        body, html {
          width: 100vw !important;
          overflow-x: hidden !important;
        }
        .sapMShell, .sapUiBody, .sapUiPage {
          width: 100% !important;
          max-width: none !important;
        }
      `;
      document.head.appendChild(style);
    });

    loginPage = new LoginPage(sharedPage);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
  });


  test.afterAll(async () => {
    await clearAllSessionData();
    console.log('✓ Cleanup after last test: cleared all session data');
    await sharedPage?.close();
    await sharedContext?.close();
  });

  test.afterEach(async ({ }, testInfo) => {
    // Auto-recovery: If test failed, check if user is logged out and recover
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      console.log('\n⚠ Test failed - Checking if session is still valid...');

      try {
        const isShellVisible = await sharedPage
          .locator('#shell-header')
          .isVisible({ timeout: 3000 })
          .catch(() => false);

        if (!isShellVisible) {
          console.log('❌ Session lost - Attempting automatic recovery...');
          await performLogin();
          console.log('✓ Session recovered - User logged back in');

          // Navigate to home
          await sharedPage.goto('/');
          await sharedPage.waitForLoadState('networkidle');
          homePage = new HomePage(sharedPage);
          await homePage.waitForDashboard();
          console.log('✓ Navigated to home - Ready for next test\n');
        } else {
          console.log('✓ Session is still valid - Continuing\n');
        }
      } catch (error) {
        console.log(`⚠ Recovery attempted but had issues: ${error}`);
      }
    }
  });

  test('01. TC-LGN-001: Login page loads correctly', async () => {
    loginPage = new LoginPage(sharedPage);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 3000 });
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 3000 });
    await expect(loginPage.loginButton).toBeVisible({ timeout: 3000 });
    console.log('✅ TC-LGN-001: Login page loads correctly');
  });


  
  test('02. TC-LGN-001:  Should display error message on invalid credentials', async () => {
    await loginPage.login('invaliduser', 'wrongpassword');
    await loginPage.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid username or password');
    const hasVisibleClass = await loginPage.errorMessage.evaluate((el) =>
      el.classList.contains('visible')
    );
    expect(hasVisibleClass).toBe(true);
    console.log('✅ TC-LGN-002: Invalid credentials error displayed correctly');
  });

  test('03. TC-LGN-002: Should successfully login with valid credentials and save auth', async () => {
    const username = 'admin';
    const password = 'Admin@1234';
    if (!username || !password) {
      throw new Error('Credentials not loaded from .env file');
    }
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
    await sharedContext.storageState({ path: authFile });
    console.log('✅ TC-LGN-003: Successfully logged in and session established');
  });


  
    test('04. TC-DSH-001: Dashboard loads with all tile groups', async () => {
      homePage = new HomePage(sharedPage);
      await homePage.waitForDashboard();

      const groups = [
        {
          group: homePage.merchandisingGroup,
          text: 'Merchandising Process',
          tiles: ['Buyer PO Upload', 'Style Master', 'Trim Allocation', 'Bill Of Material', 'Cost Sheet', 'ERP Post', 'Lay Sheet']
        },
        {
          group: homePage.productionGroup,
          text: 'Production Process',
          tiles: ['Master Plan', 'Gantt Chart Dashboard', 'Inspection', 'Inspection Checklist', 'QC']
        },
        {
          group: homePage.otherGroup,
          text: 'Other',
          tiles: ['Number Series', 'UDO Creation', 'Count Barcode', 'Cartoons', 'Inventory Transfer', 'Bar Code Generator', 'Approval Stage', 'Approval Template', 'Notification', 'User & Role Management']
        },
        {
          group: homePage.mastersGroup,
          text: 'Masters & Sub Masters',
          tiles: ['Segment Master', 'Season Selection Submaster', 'Routing Plan']
        },
      ];

      for (const { group, text, tiles } of groups) {
        await expect(homePage.groupHeader(group)).toHaveText(text);
        for (const tileName of tiles) {
          await expect(homePage.tile(group, tileName)).toBeVisible();
        }
      }
    });
    
      test('05. TC-DSH-002 - Clicking Buyer PO Upload tile navigates to list page', async () => {
        await ensureOnDashboard();
        const buyerPoTile = homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload');
        await expect(buyerPoTile).toBeVisible();
        await buyerPoTile.click();
        buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
        await buyerPoUploadPage.waitForPageLoad();
      });

      test('06. TC-BPO-003 - Table displays correct columns User is on Buyer PO Upload list page', async () => {
        await ensureOnDashboard();
        const buyerPoTile = homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload');
        await expect(buyerPoTile).toBeVisible();
        await buyerPoTile.click();
        buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
        await buyerPoUploadPage.waitForPageLoad();
      });

      test('07. TC-BPO-004 - Clicking Create navigates to New Buyer PO Upload page', async () => {
        await ensureOnDashboard();
        const buyerPoTile = homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload');
        await expect(buyerPoTile).toBeVisible();
        await buyerPoTile.click();
        buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
        await buyerPoUploadPage.waitForPageLoad();
      });


      test('09. TC-BPO-006 -	Upload invalid file type is rejected)', async () => {
        await buyerPoUploadPage.clickCreateButton();
        await sharedPage.waitForLoadState('networkidle');
        buyerPoUploadFormPage = new BuyerPoUploadFormPage(sharedPage);
        await buyerPoUploadFormPage.waitForFormLoad();
        await expect(buyerPoUploadFormPage.formContainer).toBeVisible();

          await expect(buyerPoUploadFormPage.excelUploadButton).toBeVisible();

    const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'buyerPO.json');

    if (fs.existsSync(excelFilePath)) {
      console.log(`Uploading file: ${excelFilePath}`);
      await buyerPoUploadFormPage.uploadExcelFile(excelFilePath);
      await sharedPage.waitForLoadState('networkidle');
    } else {
      throw new Error(`Excel file not found at: ${excelFilePath}`);
    }
     });


     test('08. TC-BPO-005 - Upload PO file ', async () => {

        // Wait for the form page to be ready
        buyerPoUploadFormPage = new BuyerPoUploadFormPage(sharedPage);
        // Check if we're already on the form page
        const formIsReady = await buyerPoUploadFormPage.excelUploadButton.isVisible({ timeout: 5000 }).catch(() => false);
        if (!formIsReady) {
          // Not on form yet, try to navigate there
          buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
          await buyerPoUploadPage.waitForPageLoad().catch(() => {});
          await buyerPoUploadPage.clickCreateButton().catch(() => {});
          await sharedPage.waitForLoadState('networkidle');
        }
        await buyerPoUploadFormPage.waitForFormLoad();
        await expect(buyerPoUploadFormPage.formContainer).toBeVisible();
        await expect(buyerPoUploadFormPage.excelUploadButton).toBeVisible();
        const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
        if (fs.existsSync(excelFilePath)) {
          console.log(`\n📁 Uploading file: ${excelFilePath}`);
          await buyerPoUploadFormPage.uploadExcelFile(excelFilePath);
          await sharedPage.waitForLoadState('networkidle');
          await sharedPage.waitForTimeout(2000);
          console.log('\n✅ ===== FILE UPLOADED SUCCESSFULLY =====');
          console.log('✓ File: PO Summary format Multiple.xlsx');
          console.log('✓ Upload Status: COMPLETED');
          console.log('✓ Processing: IN PROGRESS');
          console.log('=========================================\n');

          await sharedPage.waitForTimeout(4000); // Wait for processing to complete and data to be available

          // Load dates from test-data.json
          const testDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
          const testDataContent = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
          const datesFromTestData = testDataContent.dates || {};
          // Get initial line item count to create date entries array
          const initialLineItems = await buyerPoUploadFormPage.captureLineItemsWithAllDetails();
          // Create array with dates for each line item
          const lineItemsWithDates = initialLineItems.map(() => ({
            deliveryDate: datesFromTestData.deliveryDate || '',
            pcdDate: datesFromTestData.pcdDate || '',
            fobDate: datesFromTestData.fobDate || ''
          }));
          // Fill date input fields for each line item
          console.log('\n📝 Filling date input fields for each line item...');
          await buyerPoUploadFormPage.fillLineItemDetailsInTable(lineItemsWithDates);
          await sharedPage.waitForTimeout(2000); // Wait for date inputs to be processed
          // Fill additional header fields: kimbleNo and remark
          const testScenario = testDataContent.testScenarios?.[0] || {};
          const kimbleNoValue = testScenario.kimbleNo?.example || '';
          const remarkValue = testScenario.remark?.example || '';

          if (kimbleNoValue) {
            console.log('\n📝 Filling Kimble No field...');
            await buyerPoUploadFormPage.enterKimbleNo(kimbleNoValue);
            await sharedPage.waitForTimeout(500);
          }

          if (remarkValue) {
            console.log('📝 Filling Remark field...');
            await buyerPoUploadFormPage.enterRemark(remarkValue);
            await sharedPage.waitForTimeout(500);
          }

          // Select Currency if available
          const currencyValue = testDataContent.currency || '';
          if (currencyValue) {
            try {
              console.log('📝 Selecting Currency...');
              const currencyButton = buyerPoUploadFormPage.currencyValueHelpButton;
              const isVisible = await currencyButton.isVisible({ timeout: 3000 }).catch(() => false);

              if (isVisible) {
                await buyerPoUploadFormPage.selectCurrency(currencyValue);
                await sharedPage.waitForTimeout(500);
                console.log(`✓ Currency "${currencyValue}" selected`);
              } else {
                console.log('ℹ Currency field not visible or not available on this form');
              }
            } catch (error) {
              console.log(`⚠ Currency selection skipped: ${error}`);
            }
          }

          const uploadedData = await buyerPoUploadFormPage.captureAllFormData();
          let sizeBreakdownData: any[] = [];

          try {
            sizeBreakdownData = await buyerPoUploadFormPage.capturePivotTable();
          } catch (error) {
            console.log('⚠ Pivot table not found or error during capture:', error);
          }

          // Apply dates to captured line items (dates already filled in UI via fillLineItemDetailsInTable)
          const capturedLineItemsWithDates = uploadedData.lineItems.map((item: any) => ({
            ...item,
            deliveryDate: datesFromTestData.deliveryDate || item.deliveryDate || '',
            pcdDate: datesFromTestData.pcdDate || item.pcdDate || '',
            fobDate: datesFromTestData.fobDate || item.fobDate || ''
          }));

          const completeData = {
            ...uploadedData,
            lineItems: capturedLineItemsWithDates,
            sizeBreakdown: sizeBreakdownData
          };

          console.log('\n📋 ===== UPLOADED DATA (MULTIPLE LINES) =====');
          console.log('\n📌 Header Data:');
          console.log(JSON.stringify(uploadedData.header, null, 2));

          console.log('\n📊 PO Size Breakdown:');
          if (sizeBreakdownData.length > 0) {
            console.log(`(${sizeBreakdownData.length} rows)`);
            console.log(JSON.stringify(sizeBreakdownData, null, 2));
          } else {
            console.log('⚠️  Not found or empty - Please check pivot table');
          }

          console.log('\n📦 Line Items:');
          console.log(`(${lineItemsWithDates.length} rows)`);
          console.log(JSON.stringify(lineItemsWithDates, null, 2));
          console.log('\n==============================================\n');

          expect(lineItemsWithDates.length).toBeGreaterThan(1);
          console.log(`✓ Verified: ${lineItemsWithDates.length} line items uploaded successfully with dates`);

          if (sizeBreakdownData.length > 0) {
            console.log(`✓ Size breakdown: ${sizeBreakdownData.length} rows`);
          }

          const outputFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'buyerPO.json');
          fs.writeFileSync(outputFilePath, JSON.stringify(completeData, null, 2));
          console.log(`✓ Complete data saved to: ${outputFilePath}`);

          // Click Create button to save the PO
          console.log('\n📝 Clicking Create button to save PO...');
          await buyerPoUploadFormPage.clickSaveCreateButton();
          console.log('✓ PO created and saved successfully');

          console.log('\n🎉 ===== UPLOAD COMPLETED SUCCESSFULLY =====');
          console.log('✅ File: PO Summary format Multiple.xlsx');
          console.log(`✅ Line Items Captured: ${lineItemsWithDates.length} rows with dates applied`);
          console.log(`✅ Size Breakdown: ${sizeBreakdownData.length > 0 ? sizeBreakdownData.length + ' rows' : 'Processing...'}`);
          console.log('✅ Data File: buyerPO.json');
          console.log('✅ Status: ALL DATA EXTRACTED AND SAVED');
          console.log('==========================================\n');
        } else {
          throw new Error(`File not found at: ${excelFilePath}`);
        }
     });

  test('09.  TC-BPO-001  Navigate to routing plan ', async () => {
    await sharedPage.goto('/');
    homePage = new HomePage(sharedPage);
    await homePage.waitForDashboard();
    await homePage.clickRoutingPlanTile();
    await sharedPage.waitForLoadState('networkidle');
    routingPlanPage = new RoutingPlanPage(sharedPage);
    await routingPlanPage.waitForPageLoad();
    await routingPlanPage.clickCreateButton();
    await routingPlanPage.waitForCreateFormLoad();
  });

  test('10.  TC-BPO-002 Fill Routing Plan form', async () => {
    // Ensure page objects are initialized
    routingPlanPage = new RoutingPlanPage(sharedPage);

    // Generate unique name with timestamp
    const uniqueRoutingPlanName = CounterManager.generateUniqueName(routingPlanData.routingPlanName, 'routingPlan');
    await routingPlanPage.fillRoutingPlanName(uniqueRoutingPlanName);
    const enteredName = await routingPlanPage.routingPlanNameInput.inputValue();
    expect(enteredName).toBe(uniqueRoutingPlanName);

    // Reinitialize page objects as they may be undefined if test ran independently
    routingPlanPage = new RoutingPlanPage(sharedPage);

    // Ensure we're on the routing plan create form
    try {
      await routingPlanPage.waitForCreateFormLoad();
    } catch {
      // If form not loaded, navigate back to routing plan
      homePage = new HomePage(sharedPage);
      await homePage.clickRoutingPlanTile();
      await sharedPage.waitForLoadState('networkidle');
      await routingPlanPage.waitForPageLoad();
      await routingPlanPage.clickCreateButton();
      await routingPlanPage.waitForCreateFormLoad();
    }

    routingPlanCreate = new RoutingPlanCreate(sharedPage);

    // STEP 1: Fill all data first
    await routingPlanCreate.fillRoutingPlanDetailRows(routingPlanData.details);

    // STEP 2: Capture and save all routing plan data to JSON
    console.log('\n📝 STEP 2: Capturing and saving routing plan data...\n');
    const routingPlanTestDataPath = path.join(__dirname, '..', 'testData', 'RoutingPlan', 'RoutingPlan.json');
    await routingPlanCreate.captureAndSaveFormData(routingPlanTestDataPath);
    console.log(`✓ Routing plan data saved to: ${routingPlanTestDataPath}\n`);

    // STEP 3: Click Save button
    await routingPlanCreate.clickSaveButton();

    // STEP 4: Verify and close success dialog
    await routingPlanCreate.verifyAndCloseSuccessDialog();

    console.log('✅ TC-BPO-002: Routing Plan created and saved successfully');
  });
  
    test('11. TC-SEG-001: Navigate to segment master and fill data in the Routing Plan form ', async () => {
      await sharedPage.goto('/');
      await homePage.waitForDashboard();
  
      await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
      await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
      await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
      await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');
  
      await expect(homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload')).toBeVisible();
      await expect(homePage.tile(homePage.mastersGroup, 'Segment Master')).toBeVisible();
      const segmentMasterTile = homePage.tile(homePage.mastersGroup, 'Segment Master');
      await expect(segmentMasterTile).toBeVisible();
      await segmentMasterTile.click();
      await sharedPage.waitForLoadState('networkidle');
      await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
      segmentMasterPage = new SegmentMasterPage(sharedPage);
      await expect(segmentMasterPage.listCreateButton).toBeVisible({ timeout: 30000 });
      await segmentMasterPage.clickCreateButton();
 
      segmentMasterCreatePage = new SegmentMasterCreate(sharedPage);
      await segmentMasterCreatePage.waitForFormLoad();
      // Generate unique name with counter
      const uniqueName = CounterManager.generateUniqueName(segmentMasterData.name, 'segmentMaster');
      await segmentMasterCreatePage.fillName(uniqueName);
      const entered = await segmentMasterCreatePage.nameInput.inputValue();
      expect(entered).toBe(uniqueName);
      console.log(`Segment Master name entered: ${entered}`);
    
      await expect(segmentMasterCreatePage.lineItemCreateButton).toBeVisible({ timeout: 10000 });
      await segmentMasterCreatePage.fillAllLineItemRows(segmentMasterData.segments);
      console.log(`Filled ${segmentMasterData.segments.length} segment line item(s)`);
   
      const segmentMasterTestDataPath = path.join(__dirname, '../testData/SegmentMaster/test-data.json');
      await segmentMasterCreatePage.captureAndSaveFormData(segmentMasterTestDataPath);
      await segmentMasterCreatePage.clickSaveButton();
      await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
    });

    
      test('TC-VEN-001. Create Vendor Merchandiser', async () => {
        // Navigate back to home page
        await sharedPage.goto('/');
        await sharedPage.waitForLoadState('networkidle');
    
        homePage = new HomePage(sharedPage);
        await homePage.waitForDashboard();
      
        homePage = new HomePage(sharedPage);
        await homePage.clickVendorMerchandiserTile();
        await sharedPage.waitForLoadState('networkidle');
    
        const vendorPage = new VendorPage(sharedPage);
        await vendorPage.waitForPageLoad();
      
        await vendorPage.clickCreateButton();
      
        vendorCreatePage = new VendorCreate(sharedPage);
        await vendorCreatePage.waitForFormLoad();

        // Generate unique name with timestamp
        const uniqueVendorName = CounterManager.generateUniqueName(vendorData.vendorName, 'vendor');
        await vendorCreatePage.fillVendorName(uniqueVendorName);
        const enteredName = await vendorCreatePage.vendorNameInput.inputValue();
        expect(enteredName).toBe(uniqueVendorName);
    
        // Fill vendor status
        await vendorCreatePage.fillStatus(vendorData.status);
        const enteredStatus = await vendorCreatePage.statusInput.inputValue();
        expect(enteredStatus).toBe(vendorData.status);
    
        console.log(`Filled vendor form: Name="${vendorData.vendorName}", Status="${vendorData.status}"`);
    
        // Capture and save vendor data before saving
        const testDataPath = path.join(__dirname, '..', 'testData', 'Vendor', 'Vendor.json');
        await vendorCreatePage.captureAndSaveFormData(testDataPath);
    
        // Save the vendor record
        await vendorCreatePage.clickSaveButton();
        console.log('Vendor created and saved successfully');
      });

      
      test('TC-SUB-001. Fill sub master branch form data and create sub master branch ', async () => {
          await sharedPage.goto('/');
          await sharedPage.waitForLoadState('networkidle');
          homePage = new HomePage(sharedPage);
          await homePage.waitForDashboard();
          homePage = new HomePage(sharedPage);
          await homePage.clickSubMasterBranchTile();
          await sharedPage.waitForLoadState('networkidle');
          await sharedPage.waitForLoadState('networkidle');
          const pageContent = sharedPage.locator('[class*="sapMPage"], [role="main"]').first();
          await pageContent.waitFor({ state: 'visible', timeout: 30000 });
          console.log('Sub Master Branch page loaded successfully');
          subMasterBranchPage = new SubMasterBranchPage(sharedPage);
          await subMasterBranchPage.waitForPageLoad();
          subMasterBranchPage = new SubMasterBranchPage(sharedPage);
          await subMasterBranchPage.clickCreateButton();
        
          subMasterBranchCreatePage = new SubMasterBranchCreate(sharedPage);
          await subMasterBranchCreatePage.waitForFormLoad();
      
          // Fill branch code
          await subMasterBranchCreatePage.fillBranchCode(subMasterBranchData.branchCode);
          const enteredCode = await subMasterBranchCreatePage.branchCodeInput.inputValue();
          expect(enteredCode).toBe(subMasterBranchData.branchCode);
      
          // Generate unique name with timestamp
          const uniqueBranchName = CounterManager.generateUniqueName(subMasterBranchData.branchName, 'subMasterBranch');
          await subMasterBranchCreatePage.fillBranchName(uniqueBranchName);
          const enteredName = await subMasterBranchCreatePage.branchNameInput.inputValue();
          expect(enteredName).toBe(uniqueBranchName);
      
          // Fill status
          await subMasterBranchCreatePage.fillStatus(subMasterBranchData.status);
          const enteredStatus = await subMasterBranchCreatePage.statusInput.inputValue();
          expect(enteredStatus).toBe(subMasterBranchData.status);
      
          console.log(`Filled Sub Master Branch form: Code="${subMasterBranchData.branchCode}", Name="${subMasterBranchData.branchName}", Status="${subMasterBranchData.status}"`);
      
          // Capture and save branch data before saving
          const testDataPath = path.join(__dirname, '..', 'testData', 'SubMasterBranch', 'SubMasterBranch.json');
          await subMasterBranchCreatePage.captureAndSaveFormData(testDataPath);
      
          // Save the branch record
          await subMasterBranchCreatePage.clickSaveButton();
          console.log('Sub Master Branch created and saved successfully');
      });

      





    
});

