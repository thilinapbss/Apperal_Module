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

test.describe('Apperal Module | Regression Test Suite', () => {
  test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    sharedPage = await sharedContext.newPage();
    loginPage = new LoginPage(sharedPage);
    await loginPage.goto();
    await loginPage.waitForLoginForm();
  });

  // Re-login automatically if a previous test failure caused the session to drop.
  // Skipped for the login tests themselves (02, 03) which manage auth state directly.
  test.beforeEach(async ({}, testInfo) => {
    if (testInfo.title.startsWith('02.') || testInfo.title.startsWith('03.')) return;
    await ensureSessionValid();
  });

  test.afterAll(async () => {
    await sharedPage?.close();
    await sharedContext?.close();
  });

  test('02. Should display error message on invalid credentials', async () => {
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
  });

  test('03. Should successfully login with valid credentials and save auth', async () => {
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
  });

  test('05. Navigate to home page', async () => {
    await sharedPage.goto('/');
    homePage = new HomePage(sharedPage);
    await homePage.waitForDashboard();
  });

  // test('06. Should display all tile group headers', async () => {
  //   await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
  //   await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
  //   await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
  //   await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');
  // });

  // test('07. Should display Merchandising Process tiles', async () => {
  //   const group = homePage.merchandisingGroup;
  //   await expect(homePage.tile(group, 'Buyer PO Upload')).toBeVisible();
  //   await expect(homePage.tile(group, 'Style Master')).toBeVisible();
  //   await expect(homePage.tile(group, 'Trim Allocation')).toBeVisible();
  //   await expect(homePage.tile(group, 'Bill Of Material')).toBeVisible();
  //   await expect(homePage.tile(group, 'Cost Sheet')).toBeVisible();
  //   await expect(homePage.tile(group, 'ERP Post')).toBeVisible();
  //   await expect(homePage.tile(group, 'Lay Sheet')).toBeVisible();
  // });

  // test('08. Should display Production Process tiles', async () => {
  //   const group = homePage.productionGroup;
  //   const productionTiles = ['Master Plan', 'Gantt Chart Dashboard', 'Inspection', 'Inspection Checklist', 'QC'];

  //   for (const tileTitle of productionTiles) {
  //     const tile = homePage.tile(group, tileTitle);
  //     const isVisible = await tile.isVisible({ timeout: 5000 }).catch(() => false);
  //     if (!isVisible) {
  //       console.log(`Production tile "${tileTitle}" not found`);
  //     } else {
  //       await expect(tile).toBeVisible();
  //     }
  //   }
  // });

  // test('09. Should display Other tiles', async () => {
  //   const group = homePage.otherGroup;
  //   await expect(homePage.tile(group, 'Number Series')).toBeVisible();
  //   await expect(homePage.tile(group, 'UDO Creation')).toBeVisible();
  //   await expect(homePage.tile(group, 'Bundle Code Generation')).toBeVisible();
  //   await expect(homePage.tile(group, 'Cartoons')).toBeVisible();
  //   await expect(homePage.tile(group, 'User & Role Management')).toBeVisible();
  // });

  // test('10. Should display Masters & Sub Masters tiles', async () => {
  //   const group = homePage.mastersGroup;
  //   await expect(homePage.tile(group, 'Segment Master')).toBeVisible();
  //   await expect(homePage.tile(group, 'Routing Plan')).toBeVisible();
  //   await expect(homePage.tile(group, 'Vendor Merchandiser')).toBeVisible();
  //   await expect(homePage.tile(group, 'Sub Master Branch')).toBeVisible();
  // });

  // test('11. Click on Buyer PO Upload tile', async () => {
  //   const buyerPoTile = homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload');
  //   await expect(buyerPoTile).toBeVisible();
  //   await buyerPoTile.click();
  //   buyerPoUploadPage = new BuyerPoUploadPage(sharedPage);
  // });

  // test('12. Verify Buyer PO Upload page loaded', async () => {
  //   await buyerPoUploadPage.waitForPageLoad();
  // });

  // test('13. Click Create button', async () => {
  //   await expect(buyerPoUploadPage.createButton).toBeVisible();
  //   await buyerPoUploadPage.clickCreateButton();
  //   await sharedPage.waitForLoadState('networkidle');
  // });

  // test('14. Verify Buyer PO Upload form loaded', async () => {
  //   buyerPoUploadFormPage = new BuyerPoUploadFormPage(sharedPage);
  //   await buyerPoUploadFormPage.waitForFormLoad();
  // });

  // test('15. Verify form fields are visible', async () => {
  //   await expect(buyerPoUploadFormPage.formContainer).toBeVisible();
  // });

  // test('16. Upload Excel file - PO Summary format1.xlsx', async () => {
  //   await expect(buyerPoUploadFormPage.excelUploadButton).toBeVisible();

  //   const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');

  //   if (fs.existsSync(excelFilePath)) {
  //     console.log(`Uploading file: ${excelFilePath}`);
  //     await buyerPoUploadFormPage.uploadExcelFile(excelFilePath);
  //     await sharedPage.waitForLoadState('networkidle');
  //   } else {
  //     throw new Error(`Excel file not found at: ${excelFilePath}`);
  //   }
  // });

  // test('18. Verify file upload processed', async () => {
  //   await sharedPage.waitForLoadState('networkidle');
  //   await sharedPage.waitForTimeout(2000);
  //   console.log('File upload processed, form ready for verification');
  // });

  // test('19. Read Excel file and verify data loaded', async () => {
  //   const excelFilePath = path.join(__dirname, '..', 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
  //   const excelData = ExcelReader.readBuyerPOFile(excelFilePath);

  //   await sharedPage.waitForTimeout(5000);

  //   const buyerValue = await buyerPoUploadFormPage.getBuyerValue();
  //   const styleNoValue = await buyerPoUploadFormPage.getStyleNoValue();
  //   const styleDescValue = await buyerPoUploadFormPage.getStyleDescriptionValue();
  //   const styleColorValue = await buyerPoUploadFormPage.getStyleColorValue();
  //   const seasonValue = await buyerPoUploadFormPage.getSeasonValue();

  //   console.log('Extracted Excel Data:', excelData);
  //   console.log('Form Values:', { buyer: buyerValue, styleNo: styleNoValue, styleDescription: styleDescValue, styleColor: styleColorValue, season: seasonValue });

  //   if (excelData.styleNo) {
  //     expect(styleNoValue).toContain(excelData.styleNo);
  //   }
  //   if (excelData.styleDescription) {
  //     expect(styleDescValue).toContain(excelData.styleDescription);
  //   }
  //   if (excelData.styleColor) {
  //     expect(styleColorValue).toContain(excelData.styleColor);
  //   }
  //   if (excelData.season) {
  //     expect(seasonValue).toContain(excelData.season);
  //   }
  // });

  // test('20. Fill form: Select supplier, enter PO Date and Kimble Number', async () => {
  //   console.log('Step 1: Opening Supplier Code value help dialog...');
  //   await expect(buyerPoUploadFormPage.supplierCodeValueHelpButton).toBeVisible();
  //   await buyerPoUploadFormPage.clickSupplierCodeValueHelpButton();
  //   await sharedPage.waitForLoadState('networkidle');

  //   console.log('Step 2: Selecting supplier from value help list...');
  //   const supplierDescription = testData.suppliers[0].Description;
  //   const supplierValue = testData.suppliers[0].Value;
  //   console.log(`Selecting supplier: ${supplierDescription} (${supplierValue})`);

  //   try {
  //     await buyerPoUploadFormPage.selectSupplierByCode(supplierDescription || supplierValue);
  //     console.log(`Selected supplier: ${supplierDescription}`);
  //   } catch {
  //     try {
  //       await buyerPoUploadFormPage.selectSupplierByCode(supplierValue);
  //       console.log(`Selected supplier by value: ${supplierValue}`);
  //     } catch {
  //       console.log('Supplier code not found, selecting first supplier instead');
  //       await buyerPoUploadFormPage.selectFirstSupplierFromValueHelpList();
  //     }
  //   }

  //   console.log('Step 3: Selecting PO Date from calendar...');
  //   await buyerPoUploadFormPage.selectTodayFromCalendar();
  //   const enteredDate = await buyerPoUploadFormPage.getPODateValue();
  //   console.log(`PO Date selected: ${enteredDate}`);

  //   console.log('Step 4: Entering Kimble Number...');
  //   const kimbleNo = testData.testScenarios[0].kimbleNo.example;
  //   await buyerPoUploadFormPage.enterKimbleNo(kimbleNo);
  //   const enteredKimbleNo = await buyerPoUploadFormPage.getKimbleNoValue();
  //   expect(enteredKimbleNo).toBe(kimbleNo);
  //   console.log(`Kimble No entered: ${enteredKimbleNo}`);
  // });

  // test('21. Enter Remark', async () => {
  //   const remark = testData.testScenarios[0].remark.example;
  //   await buyerPoUploadFormPage.enterRemark(remark);
  //   const enteredRemark = await buyerPoUploadFormPage.getRemarkValue();
  //   expect(enteredRemark).toContain(remark);
  // });

  // test('22. Fill in all line item details (Delivery No, Dates)', async () => {
  //   const lineItems = testData.testScenarios[0].lineItems;
  //   await buyerPoUploadFormPage.fillLineItemDetailsInTable(lineItems);
  // });

  // test('22b. Capture all entered form data and save to buyerPO.json', async () => {
  //   const formData = await buyerPoUploadFormPage.captureAllFormData();
  //   console.log('Captured form data:', JSON.stringify(formData, null, 2));

  //   const outputPath = path.join(__dirname, '../testData/Buyer_PO_Upload/buyerPO.json');
  //   fs.writeFileSync(outputPath, JSON.stringify(formData, null, 2));
  //   console.log(`Form data saved to ${outputPath}`);
  // });

  // test('23. Click Save/Create button to save the form', async () => {
  //   await buyerPoUploadFormPage.clickSaveCreateButton();
  // });

  // test('24. Capture all line item details and update test data JSON', async () => {
  //   const capturedLineItems = await buyerPoUploadFormPage.captureLineItemsWithAllDetails();
  //   console.log('Captured Line Items:', JSON.stringify(capturedLineItems, null, 2));

  //   const validItems = capturedLineItems.filter((item: any) => item.partNo && item.deliveryNo);
  //   expect(validItems.length).toBeGreaterThan(0);
  //   console.log(`Captured ${validItems.length} line items with complete data`);

  //   testData.testScenarios[0].lineItems = validItems.map((item: any) => ({
  //     poNo: item.poNo,
  //     countryCode: item.countryCode,
  //     partNo: item.partNo,
  //     qty: item.qty,
  //     deliveryDate: item.deliveryDate,
  //     pcdDate: item.pcdDate,
  //     fobDate: item.fobDate,
  //     deliveryNo: item.deliveryNo,
  //   }));

  //   const updatedTestDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
  //   fs.writeFileSync(updatedTestDataPath, JSON.stringify(testData, null, 2));
  //   console.log('Test data JSON updated with actual delivery numbers and values');
  // });

  // test('25. Verify saved record appears in the Buyer PO Upload list', async () => {
  //   await buyerPoUploadFormPage.navigateBackToList();

  //   const buyerPOPath = path.join(__dirname, '../testData/Buyer_PO_Upload/buyerPO.json');
  //   const buyerPOData = JSON.parse(fs.readFileSync(buyerPOPath, 'utf-8'));

  //   const supplierCode = buyerPOData.header.supplierCode;
  //   const styleNo = buyerPOData.header.styleNo;
  //   const season = buyerPOData.header.season;

  //   console.log('Verifying record with:', { supplierCode, styleNo, season });

  //   const result = await buyerPoUploadFormPage.verifyRecordInListTable({ supplierCode, styleNo, season });

  //   console.log(`Total rows in list: ${result.totalRows}`);
  //   console.log(`Matching rows: ${result.matchCount}`);
  //   expect(result.found).toBe(true);
  // });

  // test('26. Navigate to home page and verify tile content', async () => {
  //   await sharedPage.goto('/');
  //   await homePage.waitForDashboard();

  //   await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
  //   await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
  //   await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
  //   await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');

  //   await expect(homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload')).toBeVisible();
  //   await expect(homePage.tile(homePage.mastersGroup, 'Segment Master')).toBeVisible();
  // });

  // test('27. Click on Segment Master tile and verify navigation', async () => {
  //   const segmentMasterTile = homePage.tile(homePage.mastersGroup, 'Segment Master');
  //   await expect(segmentMasterTile).toBeVisible();
  //   await segmentMasterTile.click();
  //   await sharedPage.waitForLoadState('networkidle');
  //   await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
  // });

  // test('28. Click Create button on Segment Master list', async () => {
  //   segmentMasterPage = new SegmentMasterPage(sharedPage);
  //   await expect(segmentMasterPage.listCreateButton).toBeVisible({ timeout: 30000 });
  //   await segmentMasterPage.clickCreateButton();
  // });

  // test('29. Enter name in Segment Master Create form', async () => {
  //   segmentMasterCreatePage = new SegmentMasterCreate(sharedPage);
  //   await segmentMasterCreatePage.waitForFormLoad();
  //   await segmentMasterCreatePage.fillName(segmentMasterData.name);
  //   const entered = await segmentMasterCreatePage.nameInput.inputValue();
  //   expect(entered).toBe(segmentMasterData.name);
  //   console.log(`Segment Master name entered: ${entered}`);
  // });

  // test('29b. Add all segment line items', async () => {
  //   await expect(segmentMasterCreatePage.lineItemCreateButton).toBeVisible({ timeout: 10000 });
  //   await segmentMasterCreatePage.fillAllLineItemRows(segmentMasterData.segments);
  //   console.log(`Filled ${segmentMasterData.segments.length} segment line item(s)`);
  // });

  // test('29c. Save Segment Master record', async () => {
  //   const segmentMasterTestDataPath = path.join(__dirname, '../testData/SegmentMaster/test-data.json');
  //   await segmentMasterCreatePage.captureAndSaveFormData(segmentMasterTestDataPath);
  //   await segmentMasterCreatePage.clickSaveButton();
  //   await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
  // });

  // test('30. Navigate to home page and verify tile order', async () => {
  //   await sharedPage.goto('/');
  //   await homePage.waitForDashboard();
  // });

  // test('31. Verify Masters & Sub Masters tiles are displayed in correct order', async () => {
  //   await expect(homePage.tile(homePage.mastersGroup, 'Segment Master')).toBeVisible();
  //   await expect(homePage.tile(homePage.mastersGroup, 'Routing Plan')).toBeVisible();
  // });

  // test('32. Click on Routing Plan tile', async () => {
  //   await homePage.clickRoutingPlanTile();
  //   await sharedPage.waitForLoadState('networkidle');
  // });

  // test('33. Click Create button in Routing Plan', async () => {
  //   routingPlanPage = new RoutingPlanPage(sharedPage);
  //   await routingPlanPage.waitForPageLoad();
  //   await routingPlanPage.clickCreateButton();
  // });

  // test('34. Wait for Routing Plan create form to load', async () => {
  //   await routingPlanPage.waitForCreateFormLoad();
  // });

  // test('35. Fill Routing Plan Name', async () => {
  //   await routingPlanPage.fillRoutingPlanName(routingPlanData.routingPlanName);
  //   const enteredName = await routingPlanPage.routingPlanNameInput.inputValue();
  //   expect(enteredName).toBe(routingPlanData.routingPlanName);
  // });

  // test('36. Fill Routing Plan Detail Rows', async () => {
  //   // Reinitialize page objects as they may be undefined if test ran independently
  //   routingPlanPage = new RoutingPlanPage(sharedPage);

  //   // Ensure we're on the routing plan create form
  //   try {
  //     await routingPlanPage.waitForCreateFormLoad();
  //   } catch {
  //     // If form not loaded, navigate back to routing plan
  //     homePage = new HomePage(sharedPage);
  //     await homePage.clickRoutingPlanTile();
  //     await sharedPage.waitForLoadState('networkidle');
  //     await routingPlanPage.waitForPageLoad();
  //     await routingPlanPage.clickCreateButton();
  //     await routingPlanPage.waitForCreateFormLoad();
  //   }

  //   routingPlanCreate = new RoutingPlanCreate(sharedPage);
  //   await routingPlanCreate.fillRoutingPlanDetailRows(routingPlanData.details);
  //   console.log(`Filled ${routingPlanData.details.length} routing plan detail rows`);
  // });

  // test('37. Save Routing Plan', async () => {
  //   // Reinitialize page objects as they may be undefined
  //   routingPlanPage = new RoutingPlanPage(sharedPage);
  //   routingPlanCreate = new RoutingPlanCreate(sharedPage);

  //   // Ensure we're on the create form
  //   try {
  //     await routingPlanPage.waitForCreateFormLoad();
  //   } catch {
  //     // If form not loaded, navigate back
  //     homePage = new HomePage(sharedPage);
  //     await homePage.clickRoutingPlanTile();
  //     await sharedPage.waitForLoadState('networkidle');
  //     await routingPlanPage.waitForPageLoad();
  //     await routingPlanPage.clickCreateButton();
  //     await routingPlanPage.waitForCreateFormLoad();
  //   }

  //   // Capture and save routing plan data before saving
  //   const testDataPath = path.join(__dirname, '..', 'testData', 'RoutingPlan', 'RoutingPlan.json');
  //   await routingPlanCreate.captureAndSaveFormData(testDataPath);

  //   await routingPlanPage.clickSaveButton();
  // });

  // test('38. Navigate to home page from Routing Plan', async () => {
  //   // Navigate back to home page
  //   await sharedPage.goto('http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#Shell-home');
  //   await sharedPage.waitForLoadState('networkidle');

  //   homePage = new HomePage(sharedPage);
  //   await homePage.waitForDashboard();
  // });

  // test('39. Click on Vendor Merchandiser tile', async () => {
  //   homePage = new HomePage(sharedPage);
  //   await homePage.clickVendorMerchandiserTile();
  //   await sharedPage.waitForLoadState('networkidle');
  // });

  // test('40. Wait for Vendor page to load', async () => {
  //   const vendorPage = new VendorPage(sharedPage);
  //   await vendorPage.waitForPageLoad();
  // });

  // test('41. Click Create button in Vendor', async () => {
  //   vendorPage = new VendorPage(sharedPage);
  //   await vendorPage.clickCreateButton();
  // });

  // test('42. Fill Vendor Form and Save', async () => {
  //   vendorCreatePage = new VendorCreate(sharedPage);
  //   await vendorCreatePage.waitForFormLoad();

  //   // Fill vendor name
  //   await vendorCreatePage.fillVendorName(vendorData.vendorName);
  //   const enteredName = await vendorCreatePage.vendorNameInput.inputValue();
  //   expect(enteredName).toBe(vendorData.vendorName);

  //   // Fill vendor status
  //   await vendorCreatePage.fillStatus(vendorData.status);
  //   const enteredStatus = await vendorCreatePage.statusInput.inputValue();
  //   expect(enteredStatus).toBe(vendorData.status);

  //   console.log(`Filled vendor form: Name="${vendorData.vendorName}", Status="${vendorData.status}"`);

  //   // Capture and save vendor data before saving
  //   const testDataPath = path.join(__dirname, '..', 'testData', 'Vendor', 'Vendor.json');
  //   await vendorCreatePage.captureAndSaveFormData(testDataPath);

  //   // Save the vendor record
  //   await vendorCreatePage.clickSaveButton();
  //   console.log('Vendor created and saved successfully');
  // });

  // test('43. Navigate to home page from Vendor', async () => {
  //   // Navigate back to home page
  //   await sharedPage.goto('http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#Shell-home');
  //   await sharedPage.waitForLoadState('networkidle');

  //   homePage = new HomePage(sharedPage);
  //   await homePage.waitForDashboard();
  // });

  // test('44. Click on Sub Master Branch tile', async () => {
  //   homePage = new HomePage(sharedPage);
  //   const subMasterBranchTile = sharedPage.locator('a[href*="apperalsubmasterbranch-display"]');
  //   await subMasterBranchTile.click();
  //   await sharedPage.waitForLoadState('networkidle');
  // });


  // test('45. Wait for Sub Master Branch page to load', async () => {
  //   // Wait for the Sub Master Branch list page to load
  //   await sharedPage.waitForLoadState('networkidle');
  //   const pageContent = sharedPage.locator('[class*="sapMPage"], [role="main"]').first();
  //   await pageContent.waitFor({ state: 'visible', timeout: 30000 });
  //   console.log('Sub Master Branch page loaded successfully');
  // });

  // test('46. Wait for Sub Master Branch page to fully load', async () => {
  //   subMasterBranchPage = new SubMasterBranchPage(sharedPage);
  //   await subMasterBranchPage.waitForPageLoad();
  // });

  // test('47. Click Create button in Sub Master Branch', async () => {
  //   subMasterBranchPage = new SubMasterBranchPage(sharedPage);
  //   await subMasterBranchPage.clickCreateButton();
  // });

  // test('48. Fill Sub Master Branch Form and Save', async () => {
  //   subMasterBranchCreatePage = new SubMasterBranchCreate(sharedPage);
  //   await subMasterBranchCreatePage.waitForFormLoad();

  //   // Fill branch code
  //   await subMasterBranchCreatePage.fillBranchCode(subMasterBranchData.branchCode);
  //   const enteredCode = await subMasterBranchCreatePage.branchCodeInput.inputValue();
  //   expect(enteredCode).toBe(subMasterBranchData.branchCode);

  //   // Fill branch name
  //   await subMasterBranchCreatePage.fillBranchName(subMasterBranchData.branchName);
  //   const enteredName = await subMasterBranchCreatePage.branchNameInput.inputValue();
  //   expect(enteredName).toBe(subMasterBranchData.branchName);

  //   // Fill status
  //   await subMasterBranchCreatePage.fillStatus(subMasterBranchData.status);
  //   const enteredStatus = await subMasterBranchCreatePage.statusInput.inputValue();
  //   expect(enteredStatus).toBe(subMasterBranchData.status);

  //   console.log(`Filled Sub Master Branch form: Code="${subMasterBranchData.branchCode}", Name="${subMasterBranchData.branchName}", Status="${subMasterBranchData.status}"`);

  //   // Capture and save branch data before saving
  //   const testDataPath = path.join(__dirname, '..', 'testData', 'SubMasterBranch', 'SubMasterBranch.json');
  //   await subMasterBranchCreatePage.captureAndSaveFormData(testDataPath);

  //   // Save the branch record
  //   await subMasterBranchCreatePage.clickSaveButton();
  //   console.log('Sub Master Branch created and saved successfully');
  // });

  // test('49. Navigate to home page from Sub Master Branch', async () => {
  //   // Navigate back to home page
  //   await sharedPage.goto('http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#Shell-home');
  //   await sharedPage.waitForLoadState('networkidle');

  //   homePage = new HomePage(sharedPage);
  //   await homePage.waitForDashboard();
  // });

  test('50. Click on Style Master tile', async () => {
    homePage = new HomePage(sharedPage);
    const styleMasterTile = sharedPage.locator('a[href*="apperalstylemaster-display"]');
    await styleMasterTile.click();
    await sharedPage.waitForLoadState('networkidle');
  });

  test('51. Wait for Style Master page to load', async () => {
    // Wait for the Style Master list page to load
    await sharedPage.waitForLoadState('networkidle');
    const createButton = sharedPage.locator('button[id*="StyleMaster::LineItem::StandardAction::Create"]');
    await createButton.waitFor({ state: 'visible', timeout: 30000 });
    console.log('Style Master page loaded successfully');
  });

  test('52. Click Create button in Style Master', async () => {
    const createButton = sharedPage.locator('button[id*="StyleMaster::LineItem::StandardAction::Create"]');
    await createButton.click();
    await sharedPage.waitForLoadState('networkidle');

    // Wait for form to actually load - wait for departments value help button to appear
    await sharedPage.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]')
      .waitFor({ state: 'visible', timeout: 30000 });
    console.log('Style Master create form loaded');
  });


  test('53. Fill Style Master Form and Save', async () => {
    styleMasterCreatePage = new StyleMasterCreate(sharedPage);
    // Step 1: Wait for form to load (departments value help button visible)
    await styleMasterCreatePage.waitForFormLoad();
    console.log('Style Master form loaded');
    // Step 2: Click departments value help button to open dropdown
    await styleMasterCreatePage.clickDepartmentsValueHelp();
    console.log('Departments value help button clicked');
    // Step 3: Wait for dropdown table to load
    await styleMasterCreatePage.waitForDropdownLoad();
    console.log('Departments dropdown table loaded');
    // Step 4: Select the routing plan from dropdown
    await styleMasterCreatePage.selectDepartmentByRoutingPlan(routingPlanData.routingPlanName);
    console.log(`Selected routing plan: ${routingPlanData.routingPlanName}`);
    // Step 5: Click customer value help button to open dropdown
    await styleMasterCreatePage.clickCustomerValueHelp();
    console.log('Customer value help button clicked');
    // Step 6: Wait for customer dropdown table to load
    await styleMasterCreatePage.waitForCustomerDropdownLoad();
    console.log('Customer dropdown table loaded');
    // Step 7: Select a random customer from dropdown
    await styleMasterCreatePage.selectRandomCustomer();
    console.log('Random customer selected from dropdown');
    // Step 8: Click merchandiser value help button to open dropdown
    await styleMasterCreatePage.clickMerchandiserValueHelp();
    console.log('Merchandiser value help button clicked');
    // Step 9: Wait for merchandiser dropdown table to load
    await styleMasterCreatePage.waitForMerchandiserDropdownLoad();
    console.log('Merchandiser dropdown table loaded');
    // Step 10: Select a random merchandiser from dropdown
    await styleMasterCreatePage.selectRandomMerchandiser();
    console.log('Random merchandiser selected from dropdown');
    // Step 11: Click branch value help button to open dropdown
    await styleMasterCreatePage.clickBranchValueHelp();
    console.log('Branch value help button clicked');
    // Step 12: Wait for branch dropdown table to load
    await styleMasterCreatePage.waitForBranchDropdownLoad();
    console.log('Branch dropdown table loaded');
    // Step 13: Select the branch from dropdown using branch code from test data
    await styleMasterCreatePage.selectBranchByCode(subMasterBranchData.branchCode);
    console.log(`Selected branch: ${subMasterBranchData.branchCode}`);
    // Step 14: Click vendor merchandiser value help button to open dropdown
    await styleMasterCreatePage.clickVendorMerchandiserValueHelp();
    console.log('Vendor Merchandiser value help button clicked');
    // Step 15: Wait for vendor merchandiser dropdown table to load
    await styleMasterCreatePage.waitForVendorMerchandiserDropdownLoad();
    console.log('Vendor Merchandiser dropdown table loaded');
    // Step 16: Select the vendor merchandiser from dropdown using vendor name from test data
    await styleMasterCreatePage.selectVendorMerchandiserByName(vendorData.vendorName);
    console.log(`Selected vendor merchandiser: ${vendorData.vendorName}`);
    // Step 17: Click segment code value help button to open dropdown
    await styleMasterCreatePage.clickSegmentCodeValueHelp();
    console.log('Segment Code value help button clicked');
    // Step 18: Wait for segment code dropdown table to load
    await styleMasterCreatePage.waitForSegmentCodeDropdownLoad();
    console.log('Segment Code dropdown table loaded');
    // Step 19: Select the segment code from dropdown using code from test data
    await styleMasterCreatePage.selectSegmentCodeByCode(segmentCodeData.code);
    console.log(`Selected segment code: ${segmentCodeData.code}`);
    // Step 20: Click packing segment value help button to open dropdown
    await styleMasterCreatePage.clickPackingSegmentValueHelp();
    console.log('Packing Segment value help button clicked');
    // Step 21: Wait for packing segment dropdown table to load
    await styleMasterCreatePage.waitForPackingSegmentDropdownLoad();
    console.log('Packing Segment dropdown table loaded');
    // Step 22: Select the packing segment from dropdown using SIZ code from nested segments array
    const packingSegment = segmentMasterData.segments.find((seg: any) => seg.segmentCode === 'SIZ')!;
    await styleMasterCreatePage.selectPackingSegmentByCode(packingSegment.segmentCode);
    console.log(`Selected packing segment: ${packingSegment.segmentCode} (${packingSegment.segmentName})`);
    // Step 23: Fill Consider Packing field
    await styleMasterCreatePage.fillConsiderPacking(styleMasterData.considerPacking);
    console.log(`Filled Consider Packing: ${styleMasterData.considerPacking}`);
    // Step 24: Fill VCP field
    await styleMasterCreatePage.fillVCP(styleMasterData.vcp);
    console.log(`Filled VCP: ${styleMasterData.vcp}`);
    // Step 25: Fill Make field
    await styleMasterCreatePage.fillMake(styleMasterData.make);
    console.log(`Filled Make: ${styleMasterData.make}`);
    // Step 26: Click PO Number value help button to open dialog
    await styleMasterCreatePage.clickPONumberValueHelp();
    console.log('PO Number value help button clicked');
    // Step 27: Wait for PO Number dialog to load
    await styleMasterCreatePage.waitForPONumberDialogLoad();
    console.log('PO Number dialog loaded');
    // Step 28: Get unique PO numbers from test data and select them
    const uniquePONumbers = [...new Set(buyerPOData.lineItems.map(item => item.poNo))];
    for (const poNo of uniquePONumbers) {
      const poDisplayValue = `${poNo} (${buyerPOData.header.styleNo})`;
      try {
        await styleMasterCreatePage.selectPONumberByValue(poDisplayValue);
        console.log(`Selected PO number: ${poDisplayValue}`);
      } catch (e) {
        console.log(`PO number ${poDisplayValue} not found, trying next one`);
      }
    }
    if (uniquePONumbers.length === 0) {
      await styleMasterCreatePage.selectRandomPONumber();
      console.log('No PO numbers in test data, selected random PO number');
    }

    // Step 29: Fill Price field
    await styleMasterCreatePage.fillPrice(styleMasterData.price);
    console.log(`Filled Price: ${styleMasterData.price}`);

    // Step 30: Fill Reference field
    await styleMasterCreatePage.fillReference(styleMasterData.reference);
    console.log(`Filled Reference: ${styleMasterData.reference}`);

    // Step 31: Fill Season Selection field
    await styleMasterCreatePage.fillSeasonSelection(styleMasterData.seasonSelection);
    console.log(`Filled Season Selection: ${styleMasterData.seasonSelection}`);

    // Step 32: Fill Style Color field
    await styleMasterCreatePage.fillStyleColor(styleMasterData.styleColor);
    console.log(`Filled Style Color: ${styleMasterData.styleColor}`);

    // Step 33: Fill Style Status field
    await styleMasterCreatePage.fillStyleStatus(styleMasterData.styleStatus);
    console.log(`Filled Style Status: ${styleMasterData.styleStatus}`);

    console.log('Style Master form filled successfully');
  });

  test('53b. Fill segment data from JSON for all segments', async () => {
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  TEST 53B: FILL SEGMENT DATA FROM JSON');
    console.log('════════════════════════════════════════════════════════════');

    try {
      // Initialize page object if not already done
      if (!styleMasterCreatePage) {
        styleMasterCreatePage = new StyleMasterCreate(sharedPage);
      }

      // Check if we're still on the Style Master form, if not navigate back
      const currentUrl = sharedPage.url();
      console.log(`\n📍 Current page: ${currentUrl}`);

      let formReady = false;
      try {
        await styleMasterCreatePage.waitForFormLoad();
        formReady = true;
        console.log('  ✓ Style Master create form is already open');
      } catch {
        console.log('  ⚠️ Style Master create form not detected, navigating back to the form...');
      }

      if (!formReady) {
        await sharedPage.goto('http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#Shell-home');
        await sharedPage.waitForLoadState('networkidle');

        // Click Style Master tile
        const styleMasterTile = sharedPage.locator('[id*="StyleMaster"]').first();
        await styleMasterTile.click();
        await sharedPage.waitForLoadState('networkidle');

        // Click Create button
        const createButton = sharedPage.locator('button[id*="StyleMaster::LineItem::StandardAction::Create"]').first();
        await createButton.click();
        await sharedPage.waitForLoadState('networkidle');

        await styleMasterCreatePage.waitForFormLoad();
      }

      // Load JSON data
      const styleMasterData = JSON.parse(fs.readFileSync(styleMasterDataPath, 'utf-8'));
      const segmentTypes = Object.keys(styleMasterData.segments || {});
      if (segmentTypes.length === 0) {
        throw new Error('No segment data found in Style Master JSON');
      }
      console.log('\n📋 Loaded segments from JSON:');
      segmentTypes.forEach(segmentType => {
        console.log(`  - ${segmentType}`);
      });

      // DEBUG: Find where Color, Size, Season segments actually are on the page
      console.log('\n════════════════════════════════════════════════════════════');
      console.log('  DEBUG: LOOKING FOR SEGMENT LOCATIONS');
      console.log('════════════════════════════════════════════════════════════');

      // Search for elements containing segment names
      for (const segName of ['Color', 'Size', 'Season']) {
        const elements = await sharedPage.locator(`:has-text("${segName}")`).all();
        console.log(`\n${segName}: Found ${elements.length} elements:`);
        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          const tag = await elements[i].evaluate(el => el.tagName);
          const id = await elements[i].getAttribute('id');
          const parent = await elements[i].evaluate(el => el.parentElement?.id || 'no-parent');
          console.log(`  [${i}] ${tag} | ID: ${id} | Parent: ${parent}`);
        }
      }

      // Look for all tables that might contain segments
      const allTables = await sharedPage.locator('table[id*="Segment"], table[id*="::table"]').all();
      console.log(`\n\nFound ${allTables.length} tables with "Segment" or "::table" in ID:`);
      for (let i = 0; i < Math.min(allTables.length, 5); i++) {
        const id = await allTables[i].getAttribute('id');
        console.log(`  [${i}] ID: ${id}`);
      }

      // Look for form groups or sections that might contain our segments
      const formGroups = await sharedPage.locator('[id*="Group"], [class*="group"]').all();
      console.log(`\n\nFound ${formGroups.length} potential section containers (first 5):`);
      for (let i = 0; i < Math.min(formGroups.length, 5); i++) {
        const id = await formGroups[i].getAttribute('id');
        console.log(`  [${i}] ID: ${id}`);
      }

      // Process each segment from JSON
      const segmentResults: { [key: string]: boolean } = {};

      for (const [segmentType] of Object.entries(styleMasterData.segments)) {
        console.log(`\n🔍 Processing segment: ${segmentType}`);

        try {
          // Find the segment section
          const segment = await styleMasterCreatePage.findSegmentSectionByType(segmentType);

          if (!segment) {
            console.log(`  ✗ Segment "${segmentType}" not found on page`);
            segmentResults[segmentType] = false;
            continue;
          }

          console.log(`  ✓ Found ${segmentType} segment: ${segment.sectionName} (ID: ${segment.idName})`);

          // Click the Create button
          console.log(`  📌 Clicking Create button for ${segmentType}...`);
          await styleMasterCreatePage.clickSegmentCreateButton(segment.idName);
          console.log(`  ✓ Create button clicked`);

          segmentResults[segmentType] = true;

          // Wait a moment before processing next segment
          await sharedPage.waitForTimeout(500);

        } catch (segmentError) {
          console.error(`  ✗ Error processing ${segmentType}: ${segmentError}`);
          segmentResults[segmentType] = false;
        }
      }

      // Summary
      console.log('\n════════════════════════════════════════════════════════════');
      console.log('  SEGMENT PROCESSING SUMMARY');
      console.log('════════════════════════════════════════════════════════════');
      Object.entries(segmentResults).forEach(([segment, success]) => {
        console.log(`  ${success ? '✓' : '✗'} ${segment}`);
      });

      const successCount = Object.values(segmentResults).filter(r => r).length;
      const totalCount = Object.keys(segmentResults).length;
      console.log(`\n  Total: ${successCount}/${totalCount} segments processed successfully`);

      if (successCount === totalCount) {
        console.log('✓ TEST 53B PASSED: All segments identified and Create buttons clicked');
      } else {
        throw new Error(`Only ${successCount}/${totalCount} segments were successfully processed`);
      }

    } catch (error) {
      console.error('\n✗ TEST 53B FAILED:');
      console.error(error);
      throw error;
    }
  });

  test('54. DEBUG: Dump page HTML to find segments', async () => {
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  TEST 54: DEBUG PAGE HTML STRUCTURE');
    console.log('════════════════════════════════════════════════════════════');

    try {
      // Get the entire page HTML and search for segment-related patterns
      const pageContent = await sharedPage.content();

      // Find all IDs containing "Segment" followed by "Color", "Size", or "Season"
      const segmentPatterns = [
        { name: 'Color', pattern: /Segment\d+[^"]*Color/gi },
        { name: 'Size', pattern: /Segment\d+[^"]*Size/gi },
        { name: 'Season', pattern: /Segment\d+[^"]*Season/gi },
      ];

      console.log('\n🔍 Searching page HTML for segment patterns:\n');

      for (const { name, pattern } of segmentPatterns) {
        const matches = pageContent.match(pattern) || [];
        console.log(`${name}:`);
        if (matches.length > 0) {
          matches.forEach((match, idx) => {
            console.log(`  [${idx}] ${match.slice(0, 100)}`);
          });
        } else {
          console.log(`  No matches found`);
        }
      }

      // Also search for any ID patterns that look like segment tables
      const segmentTablePattern = /id="[^"]*::table::Segment[^"]*"/gi;
      const tableMatches = pageContent.match(segmentTablePattern) || [];
      console.log(`\n\nFound ${tableMatches.length} segment table patterns:`);
      tableMatches.slice(0, 10).forEach((match, idx) => {
        console.log(`  [${idx}] ${match}`);
      });

      // Search for specific h3 or header elements that might contain segment names
      const headerPattern = /<(h[1-6]|div[^>]*class="[^"]*title[^"]*")[^>]*>([^<]*Color|[^<]*Size|[^<]*Season)[^<]*<\/\1>/gi;
      const headerMatches = pageContent.match(headerPattern) || [];
      console.log(`\n\nFound ${headerMatches.length} header elements containing segment names:`);
      headerMatches.slice(0, 10).forEach((match, idx) => {
        console.log(`  [${idx}] ${match.slice(0, 150)}`);
      });

    } catch (error) {
      console.error('\n✗ DEBUG FAILED:');
      console.error(error);
      throw error;
    }
  });

  test('56. Identify Color segment and click Create button', async () => {
    console.log('\n════════════════════════════════════════════════════════════');
    console.log('  TEST 56: IDENTIFY COLOR SEGMENT AND CLICK CREATE');
    console.log('════════════════════════════════════════════════════════════');

    try {
      // Initialize page object if not already done
      if (!styleMasterCreatePage) {
        styleMasterCreatePage = new StyleMasterCreate(sharedPage);
      }

      // Check if we're on the correct page
      const currentUrl = sharedPage.url();
      console.log(`  Current URL: ${currentUrl}`);

      if (!currentUrl.includes('apperalstylemaster-display') && !currentUrl.includes('StyleMaster')) {
        console.log('  Not on Style Master page, navigating back...');
        await sharedPage.goto('http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#Shell-home');
        await sharedPage.waitForTimeout(2000);
      }

      // Now look for segment sections on the page
      console.log('\n📍 Searching for segment sections...');

      // First, check all elements with "-title-inner" in their ID
      const allTitleElements = await sharedPage.locator('[id*="-title-inner"]').all();
      console.log(`  Found ${allTitleElements.length} elements with "-title-inner" in ID`);

      // Also check if we need to scroll down to see segment sections
      console.log('  Scrolling down to reveal segment sections...');
      await sharedPage.evaluate(() => {
        const mainContent = document.querySelector('[id*="ObjectPageForm"]');
        if (mainContent) {
          mainContent.scrollTop = mainContent.scrollHeight;
        }
      });
      await sharedPage.waitForTimeout(1000);

      // Try finding Color segment
      console.log('\n📍 Finding Color segment...');
      const colorSegment = await styleMasterCreatePage.findSegmentSectionByType('Color');

      if (!colorSegment) {
        throw new Error('Color segment not found on page');
      }

      console.log(`✓ Color segment identified:`);
      console.log(`  - Display Name: ${colorSegment.sectionName}`);
      console.log(`  - Segment ID: ${colorSegment.idName}`);

      // Click the Create button for Color segment
      console.log(`\n🔘 Clicking Create button for Color segment...`);
      await styleMasterCreatePage.clickSegmentCreateButton(colorSegment.idName);

      console.log(`✓ Create button clicked successfully for Color segment`);

      console.log('\n════════════════════════════════════════════════════════════');
      console.log('✓ TEST 56 PASSED: Color segment identified and Create clicked');
      console.log('════════════════════════════════════════════════════════════\n');

    } catch (error) {
      console.error('\n✗ TEST 56 FAILED:');
      console.error(error);
      throw error;
    }
  });

  test('55. Verify all segmentNames from SegmentMaster test-data are available in Style Master page', async () => {
    console.log('Starting verification of SegmentMaster data in Style Master page...');

    const expectedSegmentNames = segmentMasterData.segments.map((seg: any) => seg.segmentName);
    console.log(`Expected segment names: ${expectedSegmentNames.join(', ')}`);

    const navigationBar = sharedPage.locator('[id*="StyleMasterObjectPage--fe::ObjectPage-anchBar"]');
    const allSectionTabs = navigationBar.locator('[role="tab"]');
    const sectionTabsCount = await allSectionTabs.count();

    console.log(`Total tabs in navigation bar: ${sectionTabsCount}`);

    // Collect all visible section names
    const visibleSections: string[] = [];
    for (let i = 0; i < sectionTabsCount; i++) {
      const tabText = await allSectionTabs.nth(i).locator('[class*="sapMITBText"]').textContent();
      if (tabText) {
        visibleSections.push(tabText.trim());
      }
    }

    console.log(`Visible sections in Style Master: ${visibleSections.join(', ')}`);

    // Verify that all expected segment names are present in visible sections
    const allSegmentsFound = expectedSegmentNames.every((expectedName: string) => {
      return visibleSections.some(section => section.toLowerCase() === expectedName.toLowerCase());
    });

    expect(allSegmentsFound).toBe(true);
    console.log(`✓ All expected segments (${expectedSegmentNames.join(', ')}) are available in Style Master page`);

    // Display verification results
    console.log('\nSegment Verification Results:');
    expectedSegmentNames.forEach((segName: string) => {
      const found = visibleSections.some(section => section.toLowerCase() === segName.toLowerCase());
      console.log(`  ${found ? '✓' : '✗'} "${segName}" - ${found ? 'Found' : 'Not Found'}`);
    });

    console.log('Segment Master data verification completed successfully');
  });
});
