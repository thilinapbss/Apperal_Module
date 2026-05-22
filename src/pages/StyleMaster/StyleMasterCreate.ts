import { Page, Locator } from '@playwright/test';
import path from 'path';

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
  readonly poNumberValueHelpButton: Locator;
  readonly poNumberDialog: Locator;
  readonly poNumberTable: Locator;
  readonly poNumberTableBody: Locator;
  readonly poNumberOkButton: Locator;
  readonly priceInput: Locator;
  readonly referenceInput: Locator;
  readonly seasonSelectionInput: Locator;
  readonly styleColorInput: Locator;
  readonly styleStatusInput: Locator;
  readonly attachmentDetailsCreateButton: Locator;
  readonly attachmentDetailsTable: Locator;
  readonly attachmentDetailsTableBody: Locator;

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
    this.poNumberValueHelpButton = page.locator('span[id*="PONumberSelection::PONumber::MultiValueField::_mvf-inner-vhi"]');
    this.poNumberDialog = page.locator('div[role="dialog"]').filter({ hasText: 'Select: PO Numbers' });
    this.poNumberTable = page.locator('table[id*="Table-innerTable-table"]');
    this.poNumberTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
    this.poNumberOkButton = page.locator('button[id*="-ok"]');
    this.priceInput = page.locator('input[id*="OtherInformation::price::Field-edit-inner"]');
    this.referenceInput = page.locator('input[id*="OtherInformation::Reference::Field-edit-inner"]');
    this.seasonSelectionInput = page.locator('input[id*="OtherInformation::seasonselection::Field-edit-inner"]');
    this.styleColorInput = page.locator('input[id*="OtherInformation::StyleColor::Field-edit-inner"]');
    this.styleStatusInput = page.locator('input[id*="OtherInformation::stylestatus::Field-edit-inner"]');
    this.attachmentDetailsCreateButton = page.locator('button[id*="AttachmentDetails::LineItem::StandardAction::Create"]');
    this.attachmentDetailsTable = page.locator('div[id*="AttachmentDetails::LineItem-innerTable-tableCtrlCnt"]');
    this.attachmentDetailsTableBody = page.locator('tbody[id*="AttachmentDetails::LineItem-innerTable-tblBody"], table[id*="AttachmentDetails::LineItem-innerTable-table"] tbody');
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

  async clickPONumberValueHelp() {
    // Try to close any open overlays first
    try {
      await this.page.locator('[class*="sapUiBLy"]').click({ force: true, timeout: 1000 });
    } catch {
      // Overlay doesn't exist, continue
    }

    await this.poNumberValueHelpButton.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPONumberDialogLoad() {
    await this.poNumberDialog.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(500);
  }

  async selectPONumberByValue(poValue: string) {
    // Find the row index containing the PO number value
    const allRows = this.poNumberTableBody.locator('tr[role="row"]');
    const rowIndex = await allRows.filter({ hasText: poValue }).first().evaluate(el => {
      return el.getAttribute('data-sap-ui-rowindex');
    });

    // Click the row selector for this row
    const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${rowIndex}"]`);
    await rowSelector.click();
    await this.poNumberOkButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectFirstPONumber() {
    // Click the first row's selector
    const firstRowSelector = this.page.locator('[id*="Table-innerTable-rowsel0"]').first();
    await firstRowSelector.click();
    await this.poNumberOkButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectRandomPONumber() {
    // Get all PO number rows from the table
    const allRows = this.poNumberTableBody.locator('tr[role="row"]');
    const rowCount = await allRows.count();

    if (rowCount === 0) {
      throw new Error('No PO number rows found in the table');
    }

    // Select a random row (0 to rowCount-1)
    const randomIndex = Math.floor(Math.random() * rowCount);

    // Click the row selector for the selected row using the row index
    const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${randomIndex}"]`).first();
    await rowSelector.click();

    // Click the OK button to confirm selection
    await this.poNumberOkButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log(`Selected PO number at random index: ${randomIndex}`);
  }

  async fillPrice(value: string) {
    await this.priceInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async fillReference(value: string) {
    await this.referenceInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async fillSeasonSelection(value: string) {
    await this.seasonSelectionInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async fillStyleColor(value: string) {
    await this.styleColorInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async fillStyleStatus(value: string) {
    await this.styleStatusInput.fill(value);
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToAttachmentDetails() {
    await this.page.evaluate(() => window.scrollBy(0, 1000));
    await this.page.waitForTimeout(500);
  }

  async waitForAttachmentDetailsCreateButton() {
    await this.attachmentDetailsCreateButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickAttachmentDetailsCreateButton() {
    await this.attachmentDetailsCreateButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  async waitForAttachmentDetailsTableRow() {
    // Wait for a new row to be added to the table
    const rows = this.attachmentDetailsTable.locator('tbody tr[role="row"]:not([class*="sapUiTableRowHidden"])');
    await rows.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(1500);
  }

  async fillAttachmentDetailsRow(rowIndex: number, docName: string, remarks: string, filePath?: string) {

    // Fill Doc Name field (first input in the row)
    const docNameInput = this.page.locator('input[id*="__input"][id*="__clone"]').first();
    await docNameInput.click();
    await docNameInput.fill(docName);

    // Fill Remarks field (second input in the row)
    const remarksInput = this.page.locator('input[id*="__input"][id*="__clone"]').nth(1);
    await remarksInput.click();
    await remarksInput.fill(remarks);

    // Upload file if provided
    // if (filePath) {
    //   await this.uploadAttachmentFile(filePath);
    //   await this.page.waitForTimeout(1500);

    //   // Click the Generate button
    //   await this.page.locator('button[id*="RefreshSemiFinishGoods"]').click();
    //   await this.page.waitForLoadState('networkidle');
    // }

    await this.page.waitForLoadState('networkidle');
  }

  // async uploadAttachmentFile(filePath: string) {
  //   // Resolve the file path relative to the project root (go up 3 levels from src/pages/StyleMaster/)
  //   const absolutePath = path.resolve(__dirname, '../../../', filePath);
  //   console.log(`Uploading file from path: ${filePath}`);
  //   console.log(`Resolved absolute path: ${absolutePath}`);

  //   // Get all file inputs in the attachment details table
  //   const fileInputs = this.attachmentDetailsTable.locator('input[type="file"][name="FEV4FileUpload"]');
  //   const fileInputCount = await fileInputs.count();
  //   console.log(`Found ${fileInputCount} file input(s) in the table`);

  //   // Use the last file input (most recently added row)
  //   const lastFileInput = fileInputs.last();

  //   // Wait for the file input to be attached to the DOM
  //   await lastFileInput.waitFor({ state: 'attached', timeout: 10000 });
  //   console.log('File input found and attached to DOM');

  //   // Set the file directly on the input element
  //   await lastFileInput.setInputFiles(absolutePath);
  //   console.log(`File set: ${absolutePath}`);

  //   // Wait for upload to process
  //   await this.page.waitForTimeout(3000);
  //   await this.page.waitForLoadState('networkidle');
  //   console.log(`File uploaded successfully: ${filePath}`);
  // }

  async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string; filePath?: string }>) {
    for (let i = 0; i < attachmentDetails.length; i++) {
      // Click Create button to add a new row
      await this.clickAttachmentDetailsCreateButton();
      await this.waitForAttachmentDetailsTableRow();

      // Fill the row data
      const rowIndex = i;
      await this.fillAttachmentDetailsRow(
        rowIndex,
        attachmentDetails[i].docName,
        attachmentDetails[i].remarks,
        attachmentDetails[i].filePath
      );
    }
  }

  // Segment Data Entry Methods - DYNAMIC MATCHING

  async detectSegmentSectionName(segmentIndex: number): Promise<string | null> {
    try {
      // Get all segment section headers
      const sectionHeaders = this.page.locator('h3[id*="StyleMasterObjectPage--fe::table::"][id*="-title"]');
      const allHeaders = await sectionHeaders.all();

      if (segmentIndex < allHeaders.length) {
        const headerText = await allHeaders[segmentIndex].textContent();
        if (headerText) {
          console.log(`    Detected section ${segmentIndex}: ${headerText}`);
          return headerText.trim();
        }
      }
    } catch (e) {
      console.warn(`Could not detect segment section name`);
    }
    return null;
  }

  async findSegmentSectionByIndex(segmentIndex: number): Promise<{ sectionName: string; idName: string; index: number } | null> {
    try {
      console.log(`  Looking for Segment ${segmentIndex + 1}...`);

      // Get all h3 headers and filter for ones containing "Segment"
      const allH3 = this.page.locator('h3');
      const allHeaders = await allH3.all();

      let segmentCount = 0;
      for (const header of allHeaders) {
        const headerText = await header.textContent();
        if (headerText && headerText.includes('Segment')) {
          if (segmentCount === segmentIndex) {
            const displayName = headerText.trim();
            console.log(`    ✓ Found Segment ${segmentIndex + 1}: "${displayName}"`);

            // Extract ID and segment name from h3
            const headerId = await header.getAttribute('id');
            console.log(`    Full h3 id: "${headerId}"`);

            // Try to extract segment name from ID or use default pattern
            let idName = `Segment${segmentIndex + 1}`;

            if (headerId && headerId.includes('::table::')) {
              const match = headerId.match(/::table::([^:]+)::/);
              if (match && match[1]) {
                idName = match[1];
                console.log(`    ✓ Extracted segment ID: "${idName}"`);
              }
            }

            console.log(`    Using ID for selectors: "${idName}"`);
            return { sectionName: displayName, idName, index: segmentIndex };
          }
          segmentCount++;
        }
      }

      console.warn(`  Segment ${segmentIndex + 1} not found. Only found ${segmentCount} segment sections.`);
      return null;
    } catch (e) {
      console.error(`Error finding segment section at index ${segmentIndex}: ${e}`);
      return null;
    }
  }

  async scrollToSegmentSection(sectionName: string) {
    try {
      const anchor = this.page.locator(`a[id*="-anchor"]`).filter({
        has: this.page.locator(`text=${sectionName}`)
      });

      if (await anchor.count() > 0) {
        await anchor.first().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(800);
        console.log(`    ✓ Scrolled to ${sectionName} section`);
      }
    } catch (e) {
      console.log(`    Section ${sectionName} navigation skipped`);
    }
  }

  async getSegmentCreateButton(sectionName: string) {
    // Try multiple selector patterns
    const selectors = [
      `button[id*="${sectionName}::LineItem::StandardAction::Create"]`,
      `button[id*="${sectionName}"][id*="Create"]`,
      `button[id*="::LineItem::StandardAction::Create"]`
    ];

    for (const selector of selectors) {
      const buttons = await this.page.locator(selector).all();
      if (buttons.length > 0) {
        return this.page.locator(selector).first();
      }
    }

    throw new Error(`Create button not found for section: ${sectionName}`);
  }

  async clickSegmentCreateButton(sectionName: string) {
    try {
      const createButton = await this.getSegmentCreateButton(sectionName);
      await createButton.waitFor({ state: 'visible', timeout: 15000 });
      await createButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    } catch (e) {
      console.error(`Failed to find/click create button for ${sectionName}`);
      throw e;
    }
  }

  async fillSegmentValueInRow(sectionName: string, codeValue: string, nameValue: string) {
    try {
      // Find the table body for this section
      const segmentTableBody = this.page.locator(`tbody[id*="${sectionName}::LineItem"][id*="tblBody"]`);
      const count = await segmentTableBody.count();

      if (count === 0) {
        throw new Error(`Table body not found for ${sectionName}`);
      }

      await segmentTableBody.waitFor({ state: 'attached', timeout: 10000 });
      await this.page.waitForTimeout(500);

      // Get the FIRST row (always fill the first row)
      const allRows = segmentTableBody.locator('tr[role="row"]');
      const rowCount = await allRows.count();

      if (rowCount === 0) {
        console.warn(`  No rows found in ${sectionName} table`);
        return false;
      }

      // Always use the first row
      const firstRow = allRows.first();
      await firstRow.waitFor({ state: 'attached', timeout: 5000 });

      // Get input fields in the first row
      const inputs = firstRow.locator('input[type="text"]');
      const inputCount = await inputs.count();

      if (inputCount >= 2) {
        // Fill Code field (first input)
        const codeInput = inputs.nth(0);
        await codeInput.waitFor({ state: 'visible', timeout: 5000 });
        await codeInput.click();
        await codeInput.clear();
        await codeInput.fill(codeValue);
        console.log(`    → Code field filled: ${codeValue}`);

        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(300);

        // Fill Name field (second input)
        const nameInput = inputs.nth(1);
        await nameInput.waitFor({ state: 'visible', timeout: 5000 });
        await nameInput.click();
        await nameInput.clear();
        await nameInput.fill(nameValue);
        console.log(`    → Name field filled: ${nameValue}`);

        await this.page.keyboard.press('Tab');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);

        return true;
      } else {
        console.warn(`  Expected 2+ inputs but found ${inputCount}`);
        return false;
      }
    } catch (e) {
      console.error(`Failed to fill segment value in ${sectionName}: ${e}`);
      return false;
    }
  }

  async fillSegmentDataType(
    segmentDataType: string,
    segmentIndex: number,
    values: Array<{ code: string; name: string }>
  ) {
    console.log(`\n▶ Processing ${segmentDataType} (Segment ${segmentIndex + 1})...`);

    try {
      // Find the section by index
      const section = await this.findSegmentSectionByIndex(segmentIndex);

      if (!section) {
        console.warn(`✗ Could not find UI section for segment ${segmentIndex + 1}`);
        return false;
      }

      // Navigate to section
      await this.scrollToSegmentSection(section.sectionName);

      // Fill each value
      let successCount = 0;
      for (let i = 0; i < values.length; i++) {
        console.log(`  [${i + 1}/${values.length}] Filling ${values[i].name}...`);

        // Click Create button using the section's ID name
        await this.clickSegmentCreateButton(section.idName);
        await this.page.waitForTimeout(800);

        // Fill the row using the section's ID name
        const success = await this.fillSegmentValueInRow(
          section.idName,
          values[i].code,
          values[i].name
        );

        if (success) {
          console.log(`    ✓ Filled: ${values[i].code} = ${values[i].name}`);
          successCount++;
        }
      }

      console.log(`✓ ${segmentDataType}: ${successCount}/${values.length} rows filled\n`);
      return successCount === values.length;
    } catch (e) {
      console.error(`✗ Error processing ${segmentDataType}: ${e}`);
      return false;
    }
  }

  async fillAllSegmentData(segmentsData: {
    Color?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
    Size?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
    Season?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  }) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║      FILLING SEGMENT DATA FROM JSON FILE                  ║');
    console.log('║      (SEGMENT → SECTION → ROW → CELL)                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const results: { [key: string]: boolean } = {};
    const dataMapping: Array<{
      segment: string;
      section: string;
      rows: Array<{ code: string; name: string }>;
    }> = [];

    // Get all segment section indices
    const sectionHeaders = this.page.locator('h3[id*="table::"][id*="-title"]');
    const allHeaders = await sectionHeaders.all();
    console.log(`Found ${allHeaders.length} segment sections in UI\n`);

    // Process each segment type in order, mapped to section indices sequentially
    let segmentIndex = 0;
    for (const [segmentType, data] of Object.entries(segmentsData)) {
      if (data && Array.isArray(data) && data.length > 0) {
        const values = data[0].values;

        if (values && values.length > 0) {
          console.log(`\n┌─ SEGMENT: ${segmentType.toUpperCase()}`);
          console.log(`│  Source: test-data.json → segments.${segmentType}.values`);
          console.log(`│  Total Values: ${values.length}`);
          console.log(`│  UI Section: Segment ${segmentIndex + 1}`);
          console.log(`│`);

          // Show data mapping
          console.log(`│  Data Mapping:`);
          values.forEach((val, idx) => {
            console.log(`│    [${idx + 1}] Code: "${val.code}" → Name: "${val.name}"`);
          });
          console.log(`│`);

          // Execute fill - pass segment index for sequential mapping
          const success = await this.fillSegmentDataType(segmentType, segmentIndex, values);
          results[segmentType] = success;

          // Get section info
          const section = await this.findSegmentSectionByIndex(segmentIndex);
          dataMapping.push({
            segment: segmentType,
            section: section?.sectionName || `Segment ${segmentIndex + 1}`,
            rows: values
          });

          console.log(`│  Status: ${success ? '✓ COMPLETED' : '✗ FAILED'}`);
          console.log(`└─────────────────────────────────────────────────────`);

          segmentIndex++;
        }
      }
    }

    // Detailed Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║             SEGMENT DATA FILL COMPLETE SUMMARY             ║');
    console.log('╠════════════════════════════════════════════════════════════╣');

    for (const mapping of dataMapping) {
      const status = results[mapping.segment] ? '✓' : '✗';
      console.log(`║ ${status} Segment: ${mapping.segment.padEnd(8)} → Section: ${mapping.section.padEnd(15)}`);
      mapping.rows.forEach((row, idx) => {
        console.log(`║   └─ Row ${idx + 1}: [${row.code}] = ${row.name}`);
      });
    }

    console.log('╠════════════════════════════════════════════════════════════╣');
    const totalSegments = Object.keys(results).length;
    const successCount = Object.values(results).filter(r => r).length;
    console.log(`║ Total Segments: ${totalSegments} | Success: ${successCount} | Failed: ${totalSegments - successCount}`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Return summary for verification
    return {
      totalSegments,
      successCount,
      results,
      dataMapping
    };
  }
}
