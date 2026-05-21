import { Page, Locator } from '@playwright/test';

export class StyleMasterCreate {
  readonly page: Page;
  readonly departmentsValueHelpButton: Locator;
  readonly departmentsDropdownTable: Locator;
  readonly departmentsTableBody: Locator;
  readonly customerValueHelpButton: Locator;
  readonly customerDialog: Locator;
  readonly customerTableBody: Locator;
  readonly merchandiserValueHelpButton: Locator;
  readonly merchandiserDialog: Locator;
  readonly merchandiserTableBody: Locator;
  readonly branchValueHelpButton: Locator;
  readonly branchPopover: Locator;
  readonly branchTableBody: Locator;
  readonly vendorMerchandiserValueHelpButton: Locator;
  readonly vendorMerchandiserPopover: Locator;
  readonly vendorMerchandiserTableBody: Locator;
  readonly segmentCodeValueHelpButton: Locator;
  readonly segmentCodePopover: Locator;
  readonly segmentCodeTableBody: Locator;
  readonly packingSegmentValueHelpButton: Locator;
  readonly packingSegmentPopover: Locator;
  readonly packingSegmentTableBody: Locator;
  readonly considerPackingInput: Locator;
  readonly vcpInput: Locator;
  readonly makeInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
    this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
    this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
    this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
    this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog::qualifier"]');
    this.customerTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
    this.merchandiserValueHelpButton = page.locator('span[id*="DataField::Merchandiser::Field-edit-inner-vhi"]');
    this.merchandiserDialog = page.locator('div[id*="FieldValueHelp::Merchandiser::Popover"]');
    this.merchandiserTableBody = page.locator('tbody[id*="Merchandiser::Popover"][id*="tblBody"]');
    this.branchValueHelpButton = page.locator('span[id*="DataField::Branch::Field-edit-inner-vhi"]');
    this.branchPopover = page.locator('div[id*="FieldValueHelp::Branch::Popover"]');
    this.branchTableBody = page.locator('tbody[id*="Branch::Popover"][id*="tblBody"]');
    this.vendorMerchandiserValueHelpButton = page.locator('span[id*="DataField::VendorMerchandiser::Field-edit-inner-vhi"]');
    this.vendorMerchandiserPopover = page.locator('div[id*="FieldValueHelp::VendorMerchandiser::Popover"]');
    this.vendorMerchandiserTableBody = page.locator('tbody[id*="VendorMerchandiser::Popover"][id*="tblBody"]');
    this.segmentCodeValueHelpButton = page.locator('span[id*="DataField::SegmentCode::Field-edit-inner-vhi"]');
    this.segmentCodePopover = page.locator('div[id*="FieldValueHelp::SegmentCode::Popover"]');
    this.segmentCodeTableBody = page.locator('tbody[id*="SegmentCode::Popover"][id*="tblBody"]');
    this.packingSegmentValueHelpButton = page.locator('span[id*="DataField::PackingSegment::Field-edit-inner-vhi"]');
    this.packingSegmentPopover = page.locator('div[id*="FieldValueHelp::PackingSegment::Popover"]');
    this.packingSegmentTableBody = page.locator('tbody[id*="PackingSegment::Popover"][id*="tblBody"]');
    this.considerPackingInput = page.locator('input[id*="DataField::PackBaseUnit::Field-edit-inner-inner"]');
    this.vcpInput = page.locator('input[id*="DataField::VCP::Field-edit-inner-inner"]');
    this.makeInput = page.locator('input[id*="DataField::Make::Field-edit-inner-inner"]');
  }

  async waitForFormLoad() {
    await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickDepartmentsValueHelp() {
    await this.departmentsValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDropdownLoad() {
    await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectDepartmentByRoutingPlan(routingPlanName: string) {
    // Find the row containing the routing plan name and click it
    const matchingRow = this.departmentsTableBody.locator(
      `tr[role="row"]:has(span:text("${routingPlanName}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectFirstDepartment() {
    // Click the first row in the dropdown table
    const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
    await firstRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickCustomerValueHelp() {
    await this.customerValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCustomerDropdownLoad() {
    await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(2000);
  }

  async selectCustomerByName(customerName: string) {
    // Find the row containing the customer name and click it
    const matchingRow = this.customerTableBody.locator(
      `tr[role="row"]:has(span:text("${customerName}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectFirstCustomer() {
    // Click the first row in the dropdown table
    const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
    await firstRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectRandomCustomer() {
    // Wait for at least one row to be available in the customer table
    const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
    await firstRow.waitFor({ state: 'attached', timeout: 15000 });
    await this.page.waitForTimeout(2000);

    // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
    const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
    const rowCount = await allRows.count();

    if (rowCount === 0) {
      throw new Error('No customer rows found in the customer dialog table');
    }

    // Select a random row (0 to rowCount-1)
    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = allRows.nth(randomIndex);

    // Click on the first cell in the row instead of the row itself to avoid table overlay
    const firstCell = randomRow.locator('td').first();
    await firstCell.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`Selected customer at random index: ${randomIndex}`);
  }

  async clickMerchandiserValueHelp() {
    await this.merchandiserValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForMerchandiserDropdownLoad() {
    await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(2000);
  }

  async selectRandomMerchandiser() {
    // Get all merchandiser rows from the SuggestTable in the popover
    const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
    const rowCount = await allRows.count();

    if (rowCount === 0) {
      throw new Error('No merchandiser rows found in the dropdown table');
    }

    // Select a random row (0 to rowCount-1)
    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = allRows.nth(randomIndex);

    await randomRow.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`Selected merchandiser at random index: ${randomIndex}`);
  }

  async clickBranchValueHelp() {
    await this.branchValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForBranchDropdownLoad() {
    await this.branchTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectBranchByCode(branchCode: string) {
    // Find the row containing the branch code and click it
    const matchingRow = this.branchTableBody.locator(
      `tr[role="row"]:has(span:text("${branchCode}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickVendorMerchandiserValueHelp() {
    await this.vendorMerchandiserValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForVendorMerchandiserDropdownLoad() {
    await this.vendorMerchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectVendorMerchandiserByName(vendorName: string) {
    // Find the row containing the vendor name and click it
    const matchingRow = this.vendorMerchandiserTableBody.locator(
      `tr[role="row"]:has(span:text("${vendorName}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSegmentCodeValueHelp() {
    await this.segmentCodeValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForSegmentCodeDropdownLoad() {
    await this.segmentCodeTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectSegmentCodeByCode(segmentCode: string) {
    // Find the row containing the segment code and click it
    const matchingRow = this.segmentCodeTableBody.locator(
      `tr[role="row"]:has(span:text("${segmentCode}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPackingSegmentValueHelp() {
    await this.packingSegmentValueHelpButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPackingSegmentDropdownLoad() {
    await this.packingSegmentTableBody.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectPackingSegmentByCode(segmentCode: string) {
    // Find the row containing the segment code and click it
    const matchingRow = this.packingSegmentTableBody.locator(
      `tr[role="row"]:has(span:text("${segmentCode}"))`
    );
    await matchingRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async fillConsiderPacking(value: string) {
    await this.considerPackingInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async fillVCP(value: string) {
    await this.page.evaluate(() => window.scrollBy(0, 500));
    await this.page.waitForTimeout(500);

    try {
      await this.vcpInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.vcpInput.fill(value);
    } catch (e) {
      // Try alternative locator patterns
      const alternativeSelectors = [
        'input[id*="VCP"]',
        'input[placeholder*="VCP"]',
        'input[aria-label*="VCP"]',
        'input[id*="DataField::VendorCertificationProfile"]',
        'input[id*="DataField::Vcp"]'
      ];

      let found = false;
      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector).first();
          const count = await element.count();
          if (count > 0) {
            console.log(`Found VCP field using selector: ${selector}`);
            await element.fill(value);
            found = true;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!found) {
        console.error('VCP field not found with any selector. Available alternatives tried.');
        throw new Error(`Cannot find VCP input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
      }
    }

    await this.page.waitForLoadState('networkidle');
  }

  async fillMake(value: string) {
    await this.page.evaluate(() => window.scrollBy(0, 500));
    await this.page.waitForTimeout(500);

    try {
      await this.makeInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.makeInput.fill(value);
    } catch (e) {
      const alternativeSelectors = [
        'input[id*="Make"]',
        'input[placeholder*="Make"]',
        'input[aria-label*="Make"]'
      ];

      let found = false;
      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector).first();
          const count = await element.count();
          if (count > 0) {
            console.log(`Found Make field using selector: ${selector}`);
            await element.fill(value);
            found = true;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!found) {
        console.error('Make field not found with any selector.');
        throw new Error(`Cannot find Make input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
      }
    }

    await this.page.waitForLoadState('networkidle');
  }
}
