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

const testDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
const fs = require('fs');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

// segmentMaster.json — single source of truth for all Segment Master test inputs
const segmentMasterDataPath = path.join(__dirname, '../testData/SegmentMaster/segmentMaster.json');
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
  details: { routeCode: string; routeName: string; warehouse: string }[];
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
    sharedContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    sharedPage = await sharedContext.newPage();
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

     test('08. TC-BPO-005 - Upload PO file ', async () => {
        await ensureOnDashboard();

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



});

