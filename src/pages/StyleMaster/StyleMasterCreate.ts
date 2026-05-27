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
  readonly rawMaterialsSection: Locator;
  readonly rawMaterialsCreateButton: Locator;
  readonly rawMaterialsTable: Locator;
  readonly rawMaterialsTableBody: Locator;
  readonly allocationHierarchySection: Locator;
  readonly allocationHierarchyTreeTable: Locator;
  readonly allocationHierarchyTableBody: Locator;

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
    this.rawMaterialsSection = page.locator('[id*="RawMaterials"]');
    // Raw Materials Create button is a BDI element, not a button
    this.rawMaterialsCreateButton = page.locator('[id*="RawMaterials::LineItem::RawMaterials::StandardAction::Create"]');
    this.rawMaterialsTable = page.locator('div[id*="RawMaterials::LineItem-innerTable-tableCtrlCnt"]');
    // Try multiple selector patterns for table body
    this.rawMaterialsTableBody = page.locator(
      'tbody[id*="RawMaterials"][id*="LineItem"][id*="tblBody"], ' +
      'tbody[id*="RawMaterials::LineItem-innerTable-tblBody"], ' +
      'table[id*="RawMaterials::LineItem-innerTable-table"] tbody, ' +
      'table[id*="RawMaterials"] tbody'
    );
    this.allocationHierarchySection = page.locator('section[id*="StyleTreeTable"]');
    this.allocationHierarchyTreeTable = page.locator('div[id*="CustomSubSection::StyleTreeTable--styleTreeTable"]');
    this.allocationHierarchyTableBody = page.locator('table[id*="StyleTreeTable--styleTreeTable-table"] tbody');
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

  async findSegmentSectionByType(segmentType: string): Promise<{ sectionName: string; idName: string } | null> {
    try {
      console.log(`  Looking for section: "${segmentType}"...`);

      // Only search Segment1, Segment2, Segment3 (actual segments on the form)
      const segmentPatterns = ['Segment1', 'Segment2', 'Segment3'];
      const segmentMap: { [key: string]: string } = {};

      for (const segPattern of segmentPatterns) {
        const titleSelector = `span[id*="${segPattern}"][id*="-title-inner"]`;
        const count = await this.page.locator(titleSelector).count();

        // Only process if the element exists
        if (count > 0) {
          const titleElement = this.page.locator(titleSelector).first();
          const titleText = await titleElement.textContent();

          if (titleText) {
            // Clean up text: remove count like "(1)" from "Size (1)"
            const cleanedText = titleText.replace(/\s*\(\d+\)\s*$/, '').trim();
            segmentMap[segPattern] = cleanedText;
            console.log(`  Segment "${segPattern}": "${cleanedText}"`);

            // Check if this matches the segment type we're looking for
            if (cleanedText.toLowerCase() === segmentType.toLowerCase()) {
              console.log(`  ✓ Found matching segment: ${segPattern} = ${cleanedText}`);
              return { sectionName: cleanedText, idName: segPattern };
            }
          }
        }
      }

      console.log(`  Available segments: ${Object.entries(segmentMap).map(([id, name]) => `${id}=${name}`).join(', ')}`);
      console.warn(`  Section "${segmentType}" not found on page`);
      return null;
    } catch (e) {
      console.error(`Error finding segment section "${segmentType}": ${e}`);
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
    // Try multiple selector patterns - be flexible about matching the right button
    const selectors = [
      `button[id*="${sectionName}::LineItem::StandardAction::Create"]`,
      `button[id*="${sectionName}"][id*="Create"]`,
      `button[id*="::LineItem::StandardAction::Create"]`
    ];

    for (const selector of selectors) {
      const buttons = await this.page.locator(selector).all();
      if (buttons.length > 0) {
        // Return the first visible button, or first button if none are visible
        for (const btn of buttons) {
          const isVisible = await btn.isVisible().catch(() => false);
          if (isVisible) {
            return btn;
          }
        }
        // If no visible buttons, return the first one anyway
        return this.page.locator(selector).first();
      }
    }

    throw new Error(`Create button not found for section: ${sectionName}`);
  }

  async clickSegmentCreateButton(sectionName: string) {
    try {
      // First, ensure the section is visible by scrolling to it
      await this.page.evaluate((name) => {
        const section = document.querySelector(`[id*="${name}"]`);
        if (section) {
          section.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }, sectionName);
      await this.page.waitForTimeout(500);

      const createButton = await this.getSegmentCreateButton(sectionName);

      // Try normal click, but use JavaScript click if visibility is an issue
      try {
        await createButton.waitFor({ state: 'visible', timeout: 3000 });
        await createButton.click();
      } catch {
        // Button exists but is hidden - use JavaScript click
        console.log(`  → Button hidden, using JavaScript click for ${sectionName}`);
        await createButton.evaluate(el => {
          el.scrollIntoView({ behavior: 'auto', block: 'center' });
        });
        await this.page.waitForTimeout(300);

        // Try Playwright click with force option
        try {
          await createButton.click({ force: true });
        } catch {
          // Final fallback: direct JavaScript click
          await createButton.evaluate(el => {
            (el as HTMLElement).click();
          });
        }
      }

      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    } catch (e) {
      console.error(`Failed to find/click create button for ${sectionName}`);
      throw e;
    }
  }

  async fillSegmentValueInRow(sectionName: string, codeValue: string, nameValue: string) {
    try {
      // Try multiple selectors to find the table body
      const tableBodySelectors = [
        `tbody[id*="${sectionName}::LineItem"][id*="tblBody"]`,
        `tbody[id*="${sectionName}"][id*="tblBody"]`,
        `tbody[id*="::LineItem"][id*="tblBody"]`,
        `table[id*="${sectionName}"] tbody`,
        `div[id*="${sectionName}"] tbody`
      ];

      let segmentTableBody;
      for (const selector of tableBodySelectors) {
        const candidates = this.page.locator(selector);
        const count = await candidates.count();
        if (count > 0) {
          segmentTableBody = candidates;
          console.log(`  Found table body using selector: ${selector}`);
          break;
        }
      }

      if (!segmentTableBody) {
        throw new Error(`Table body not found for ${sectionName} - tried multiple selectors`);
      }

      await segmentTableBody.first().waitFor({ state: 'attached', timeout: 10000 });
      await this.page.waitForTimeout(500);

      // Get the FIRST row (always fill the first row)
      const allRows = segmentTableBody.first().locator('tr[role="row"]');
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
    values: Array<{ code: string; name: string }>
  ) {
    console.log(`\n▶ Processing ${segmentDataType}...`);

    try {
      // Find the section by segment type name
      const section = await this.findSegmentSectionByType(segmentDataType);

      if (!section) {
        console.warn(`✗ Could not find UI section for ${segmentDataType}`);
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

    // Process each segment type
    for (const [segmentType, data] of Object.entries(segmentsData)) {
      if (data && Array.isArray(data) && data.length > 0) {
        const values = data[0].values;

        if (values && values.length > 0) {
          console.log(`\n┌─ SEGMENT: ${segmentType.toUpperCase()}`);
          console.log(`│  Source: test-data.json → segments.${segmentType}.values`);
          console.log(`│  Total Values: ${values.length}`);
          console.log(`│`);

          // Show data mapping
          console.log(`│  Data Mapping:`);
          values.forEach((val, idx) => {
            console.log(`│    [${idx + 1}] Code: "${val.code}" → Name: "${val.name}"`);
          });
          console.log(`│`);

          // Execute fill
          const success = await this.fillSegmentDataType(segmentType, values);
          results[segmentType] = success;

          // Get section info
          const section = await this.findSegmentSectionByType(segmentType);
          dataMapping.push({
            segment: segmentType,
            section: section?.sectionName || segmentType,
            rows: values
          });

          console.log(`│  Status: ${success ? '✓ COMPLETED' : '✗ FAILED'}`);
          console.log(`└─────────────────────────────────────────────────────`);
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

  async fillAllSegmentDataByPosition(segmentsData: {
    [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  }) {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   FILLING SEGMENTS BY POSITION (Segment1, 2, 3)            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const segmentPositions = ['Segment1', 'Segment2', 'Segment3'];
    const results: { [key: string]: boolean } = {};
    const segmentEntries = Object.entries(segmentsData);

    // Fill segments in position order
    for (let i = 0; i < Math.min(segmentEntries.length, segmentPositions.length); i++) {
      const [segmentType, segmentData] = segmentEntries[i];
      const segmentPosition = segmentPositions[i];

      if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
        const values = segmentData[0].values;

        if (values && values.length > 0) {
          console.log(`\n┌─ POSITION: ${segmentPosition} ← ${segmentType.toUpperCase()}`);
          console.log(`│  Values to fill: ${values.length}`);

          try {
            // Fill each value - click Create for each row
            let successCount = 0;
            for (let j = 0; j < values.length; j++) {
              // Click Create button before filling each row
              console.log(`│  Clicking Create button for row ${j + 1}...`);
              await this.clickSegmentCreateButton(segmentPosition);
              console.log(`│  ✓ Create button clicked`);

              // Fill the newly created row
              const success = await this.fillSegmentValueInRow(
                segmentPosition,
                values[j].code,
                values[j].name
              );

              if (success) {
                console.log(`│    ✓ Row ${j + 1}: [${values[j].code}] = ${values[j].name}`);
                successCount++;
              } else {
                console.log(`│    ✗ Row ${j + 1}: Failed to fill`);
              }

              // Wait before next row
              if (j < values.length - 1) {
                await this.page.waitForTimeout(300);
              }
            }

            const allSuccess = successCount === values.length;
            results[segmentType] = allSuccess;
            console.log(`│  Status: ${allSuccess ? '✓ COMPLETED' : '✗ PARTIAL'} (${successCount}/${values.length})`);
            console.log(`└─────────────────────────────────────────────────────`);

            // Wait before processing next segment
            await this.page.waitForTimeout(500);
          } catch (e) {
            console.error(`│  ✗ Error: ${e}`);
            results[segmentType] = false;
            console.log(`└─────────────────────────────────────────────────────`);
          }
        }
      }
    }

    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          SEGMENT FILL BY POSITION - SUMMARY                ║');
    console.log('╠════════════════════════════════════════════════════════════╣');

    for (const [segmentType, success] of Object.entries(results)) {
      const status = success ? '✓' : '✗';
      console.log(`║ ${status} ${segmentType.padEnd(10)} filled successfully`);
    }

    const totalSegments = Object.keys(results).length;
    const successCount = Object.values(results).filter(r => r).length;
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║ Total: ${successCount}/${totalSegments} segments filled`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    return {
      totalSegments,
      successCount,
      results
    };
  }

  async clickSemiFinishGoodsGenerateButton() {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║         CLICKING SEMI-FINISH GOODS GENERATE BUTTON         ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Scroll to Semi-Finish Goods section
      console.log('  Scrolling to Semi-Finish Goods section...');
      await this.page.evaluate(() => {
        const semiFinishGoodsSection = document.querySelector('[id*="SemiFinishGoods"]');
        if (semiFinishGoodsSection) {
          semiFinishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await this.page.waitForTimeout(1000);

      // Find and click the Generate button
      const generateButton = this.page.locator(
        'button[id*="SemiFinishGoods::CustomAction::RefreshSemiFinishGoods"]'
      );

      const count = await generateButton.count();
      if (count === 0) {
        throw new Error('Semi-Finish Goods Generate button not found');
      }

      console.log('  ✓ Generate button found');
      await generateButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('  ✓ Generate button is visible');

      await generateButton.click();
      console.log('  ✓ Generate button clicked');

      // Wait for the generation process
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);

      console.log('\n║ ✓ Semi-Finish Goods data generated successfully');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return true;
    } catch (e) {
      console.error('\n✗ Failed to click Semi-Finish Goods Generate button:');
      console.error(e);
      throw e;
    }
  }

  async verifySemiFinishGoodsCombinations(
    segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
    routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  ) {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║      VERIFYING SEMI-FINISH GOODS COMBINATIONS              ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Extract segment values
      const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
      for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
        if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
          segmentValues[segmentType] = segmentData[0].values || [];
        }
      }

      console.log('📋 Segment Values:');
      for (const [segmentType, values] of Object.entries(segmentValues)) {
        console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
      }

      // Filter routes: only use Semi-Finish Goods routes
      const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
      const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);

      console.log('\n📋 Routing Routes:');
      console.log('  Semi-Finish Goods Routes:');
      semiFinishGoodsRoutes.forEach(route => {
        console.log(`    ${route.routeCode}: ${route.routeName}`);
      });
      if (finishGoodsRoutes.length > 0) {
        console.log('  Finish Goods Routes (excluded):');
        finishGoodsRoutes.forEach(route => {
          console.log(`    ${route.routeCode}: ${route.routeName}`);
        });
      }

      // Calculate expected combinations (only using Semi-Finish Goods routes)
      const sizeValues = segmentValues['Size'] || [];
      const colorValues = segmentValues['Color'] || [];
      const seasonValues = segmentValues['Season'] || [];

      const expectedCombinations: Array<{ code: string; name: string }> = [];

      for (const size of sizeValues) {
        for (const color of colorValues) {
          for (const season of seasonValues) {
            for (const route of semiFinishGoodsRoutes) {
              const code = `${size.code}-${color.code}-${season.code}-${route.routeCode}`;
              const name = `${size.name}-${color.name}-${season.name}-${route.routeName}`;
              expectedCombinations.push({ code, name });
            }
          }
        }
      }

      console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
      console.log(`  Calculation: ${sizeValues.length} sizes × ${colorValues.length} colors × ${seasonValues.length} seasons × ${semiFinishGoodsRoutes.length} semi-finish routes = ${expectedCombinations.length}`);

      // Get actual rows from table
      console.log(`\n📊 Loading all rows from virtualized table...`);
      console.log(`  (Using keyboard navigation to load all rows)`);

      // Extract all item codes using keyboard navigation
      const actualCodes: Set<string> = new Set();
      const actualNames: Map<string, string> = new Map();

      // Click on the first cell of the table to focus it
      const firstCell = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
      await firstCell.click();
      await this.page.waitForTimeout(300);

      console.log(`  ✓ Table focused`);

      // Press Ctrl+End to go to the last row to load all rows
      await this.page.keyboard.press('Control+End');
      await this.page.waitForTimeout(1000);

      console.log(`  ✓ Navigated to end of table`);

      // Now go back to the beginning
      await this.page.keyboard.press('Control+Home');
      await this.page.waitForTimeout(500);

      console.log(`  ✓ Back at beginning of table`);

      // Extract all currently rendered rows
      const tableRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
      const totalTableRows = await tableRows.count();

      console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);

      // Extract from all visible rows
      for (let i = 0; i < totalTableRows; i++) {
        const row = tableRows.nth(i);
        const cells = row.locator('td[role="gridcell"]');

        const codeCell = cells.nth(0);
        const nameCell = cells.nth(1);

        const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
        const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();

        if (code && code.trim()) {
          actualCodes.add(code.trim());
          if (name && name.trim()) {
            actualNames.set(code.trim(), name.trim());
          }
        }

        if ((i + 1) % 10 === 0) {
          console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
        }
      }

      // If we still don't have all rows, try scrolling with Page Down
      if (actualCodes.size < 36) {
        console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);

        // Click on first row again
        await firstCell.click();
        await this.page.waitForTimeout(300);

        // Press Page Down multiple times to load more rows
        for (let pageDown = 0; pageDown < 10; pageDown++) {
          await this.page.keyboard.press('PageDown');
          await this.page.waitForTimeout(400);

          // Extract visible rows after each Page Down
          const visibleRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
          const visibleCount = await visibleRows.count();

          for (let i = 0; i < visibleCount; i++) {
            const row = visibleRows.nth(i);
            const cells = row.locator('td[role="gridcell"]');
            const codeCell = cells.nth(0);
            const nameCell = cells.nth(1);

            const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
            const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();

            if (code && code.trim()) {
              actualCodes.add(code.trim());
              if (name && name.trim()) {
                actualNames.set(code.trim(), name.trim());
              }
            }
          }

          console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);

          if (actualCodes.size >= 36) {
            console.log(`  ✓ All 36 codes found!`);
            break;
          }
        }
      }

      console.log(`\n  ✓ Row extraction complete!`);
      console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);

      const actualRowCount = actualCodes.size;
      console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);

      console.log('\n🔍 Verification Results:');

      // Check if all expected combinations exist
      let foundCount = 0;
      const missingCombinations: string[] = [];

      for (const expected of expectedCombinations) {
        if (actualCodes.has(expected.code)) {
          foundCount++;
        } else {
          missingCombinations.push(expected.code);
        }
      }

      const allFound = foundCount === expectedCombinations.length;
      console.log(`  ✓ Expected: ${expectedCombinations.length}`);
      console.log(`  ✓ Found: ${foundCount}`);
      console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);

      if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
        console.log(`\n  Missing combinations (${missingCombinations.length}):`);
        missingCombinations.forEach((code, idx) => {
          console.log(`    ${idx + 1}. ${code}`);
        });
      } else if (missingCombinations.length > 10) {
        console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
        missingCombinations.slice(0, 5).forEach((code, idx) => {
          console.log(`    ${idx + 1}. ${code}`);
        });
      }

      console.log('\n╔════════════════════════════════════════════════════════════╗');
      if (allFound) {
        console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
      } else {
        console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
      }
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return {
        allFound,
        expectedCount: expectedCombinations.length,
        actualCount: actualRowCount,
        foundCount,
        missingCount: missingCombinations.length,
        missingCombinations
      };
    } catch (e) {
      console.error('\n✗ Failed to verify Semi-Finish Goods combinations:');
      console.error(e);
      throw e;
    }
  }

  async clickFinishGoodsGenerateButton() {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║           CLICKING FINISH GOODS GENERATE BUTTON            ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Scroll to Finish Goods section
      console.log('  Scrolling to Finish Goods section...');
      await this.page.evaluate(() => {
        const finishGoodsSection = document.querySelector('[id*="FinishGoods"]');
        if (finishGoodsSection) {
          finishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await this.page.waitForTimeout(1000);

      // Find and click the Generate button
      const generateButton = this.page.locator(
        'button[id*="FinishGoods::CustomAction::RefreshFinishGoods"]'
      );

      const count = await generateButton.count();
      if (count === 0) {
        throw new Error('Finish Goods Generate button not found');
      }

      console.log('  ✓ Generate button found');
      await generateButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('  ✓ Generate button is visible');

      await generateButton.click();
      console.log('  ✓ Generate button clicked');

      // Wait for the generation process
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);

      console.log('\n║ ✓ Finish Goods data generated successfully');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return true;
    } catch (e) {
      console.error('\n✗ Failed to click Finish Goods Generate button:');
      console.error(e);
      throw e;
    }
  }

  async verifyFinishGoodsCombinations(
    segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
    routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  ) {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║        VERIFYING FINISH GOODS COMBINATIONS                 ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Extract segment values
      const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
      for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
        if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
          segmentValues[segmentType] = segmentData[0].values || [];
        }
      }

      console.log('📋 Segment Values:');
      for (const [segmentType, values] of Object.entries(segmentValues)) {
        console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
      }

      // Filter routes: only use Finish Goods routes
      const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
      const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);

      console.log('\n📋 Routing Routes:');
      if (finishGoodsRoutes.length > 0) {
        console.log('  Finish Goods Routes:');
        finishGoodsRoutes.forEach(route => {
          console.log(`    ${route.routeCode}: ${route.routeName}`);
        });
      }
      console.log('  Semi-Finish Goods Routes (excluded):');
      semiFinishGoodsRoutes.forEach(route => {
        console.log(`    ${route.routeCode}: ${route.routeName}`);
      });

      // Calculate expected count (count of size values)
      const sizeValues = segmentValues['Size'] || [];
      const expectedCount = sizeValues.length;

      console.log(`\n📊 Expected Row Count: ${expectedCount}`);
      console.log(`  Expected items: ${sizeValues.map(s => `${s.code}(${s.name})`).join(', ')}`);

      // Count non-empty rows in Finish Goods section using XPath
      console.log(`\n📊 Counting non-empty rows in Finish Goods section...`);

      // Scroll to Finish Goods section
      await this.page.evaluate(() => {
        const finishGoodsElement = document.querySelector('[id*="FinishGoods"]');
        if (finishGoodsElement) {
          finishGoodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await this.page.waitForTimeout(1000);

      // Find the Finish Goods section using a more robust selector
      const finishGoodsSection = this.page.locator('section[id*="FinishGoods"]');
      const sectionCount = await finishGoodsSection.count();

      if (sectionCount === 0) {
        throw new Error('Finish Goods section not found on the page');
      }

      // Find all rows in the section that have data (input with non-empty value)
      const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
      const actualRowCount = await dataRows.count();

      console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
      console.log(`\n📊 Actual Rows: ${actualRowCount}`);
      console.log(`\n🔍 Verification Results:`);
      console.log(`  ✓ Expected: ${expectedCount}`);
      console.log(`  ✓ Found: ${actualRowCount}`);

      const allFound = actualRowCount === expectedCount;
      console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);

      console.log('\n╔════════════════════════════════════════════════════════════╗');
      if (allFound) {
        console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
      } else {
        console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
      }
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return {
        allFound,
        expectedCount,
        actualCount: actualRowCount,
        foundCount: actualRowCount,
        missingCount: Math.max(0, expectedCount - actualRowCount),
        missingCombinations: []
      };
    } catch (e) {
      console.error('\n✗ Failed to verify Finish Goods combinations:');
      console.error(e);
      throw e;
    }
  }

  async selectBuyerPOItemsForFinishGoods() {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║         FILLING BUYER PO ITEMS FOR FINISH GOODS             ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Find the Finish Goods table
      const finishGoodsTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');

      // Get the actual data tbody (skip header clones)
      const dataTableBody = finishGoodsTable.locator('tbody').last();

      // Get all data rows
      const allRows = dataTableBody.locator('tr[role="row"]');
      const totalTableRows = await allRows.count();

      // First pass: Count only non-empty rows
      let nonEmptyRowCount = 0;
      for (let i = 0; i < totalTableRows; i++) {
        const row = allRows.nth(i);
        const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
        const itemCodeInput = itemCodeCell.locator('input').first();
        const itemCode = await itemCodeInput.inputValue();
        if (itemCode && itemCode.trim() !== '') {
          nonEmptyRowCount++;
        }
      }

      const totalRows = nonEmptyRowCount;
      console.log(`📋 Found ${totalRows} rows with data (${totalTableRows} total rows in table)\n`);

      let successCount = 0;

      // Loop through each row
      for (let i = 0; i < totalTableRows; i++) {
        try {
          // Get fresh row reference for each iteration
          const freshAllRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody').last().locator('tr[role="row"]');
          const currentRow = freshAllRows.nth(i);

          // Get ItemCode value from first column
          const itemCodeCell = currentRow.locator('td[data-sap-ui-colid*="ItemCode"]').first();
          const itemCodeInput = itemCodeCell.locator('input').first();
          const itemCode = await itemCodeInput.inputValue();

          // Skip empty rows
          if (!itemCode || itemCode.trim() === '') {
            console.log(`  Row ${i + 1}: ⊘ Skipped (empty)`);
            continue;
          }

          console.log(`  ╔═══════════════════════════════════════════════════════╗`);
          console.log(`  ║ Row ${i + 1} - ItemCode: ${itemCode.toUpperCase()}`);
          console.log(`  ╚═══════════════════════════════════════════════════════╝`);

          // Calculate price: 1500 for first row, then add 500 for each subsequent row
          // Row 1: 1500, Row 2: 2000, Row 3: 2500, etc.
          const basePrice = 1500;
          const incrementPerRow = 500;
          let rowCountForPricing = 0;

          // Count non-empty rows up to current row to get accurate row number
          for (let k = 0; k <= i; k++) {
            const tempRow = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody').last().locator('tr[role="row"]').nth(k);
            const tempItemCodeCell = tempRow.locator('td[data-sap-ui-colid*="ItemCode"]').first();
            const tempItemCodeInput = tempItemCodeCell.locator('input').first();
            const tempItemCode = await tempItemCodeInput.inputValue();
            if (tempItemCode && tempItemCode.trim() !== '') {
              rowCountForPricing++;
            }
          }

          const price = String(basePrice + ((rowCountForPricing - 1) * incrementPerRow));

          // Scroll row into view
          await currentRow.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(300);

          // ===== FILL BUYER PO ITEM =====
          const buyerPOItemCell = currentRow.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first();
          await buyerPOItemCell.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

          const buyerPOInput = buyerPOItemCell.locator('input[role="combobox"]').first();
          const buyerPOExists = await buyerPOInput.count();

          if (buyerPOExists === 0) {
            console.log(`    ✗ BuyerPOItem input field not found`);
            continue;
          }

          // ===== FILL BUYER PO ITEM via TYPING WITH VERIFICATION =====
          try {
            const maxRetries = 3;
            let entryAttempt = 0;
            let entrySuccess = false;

            while (entryAttempt < maxRetries && !entrySuccess) {
              entryAttempt++;

              // Click to focus the field
              await buyerPOInput.click();
              await this.page.waitForTimeout(200);

              // Clear any existing value
              await buyerPOInput.fill('');
              await this.page.waitForTimeout(150);

              // Type the value - input will auto-convert to uppercase
              await buyerPOInput.fill(itemCode.toUpperCase());
              console.log(`    Attempt ${entryAttempt}: Entered '${itemCode.toUpperCase()}'`);

              // Wait for input field to settle and process the value
              await this.page.waitForTimeout(500);

              // Verify the value was actually entered and confirmed
              const currentValue = await buyerPOInput.inputValue();
              console.log(`      → Field value: '${currentValue}'`);

              // Check if value matches (accounting for auto-uppercase)
              if (currentValue && currentValue.trim().toUpperCase() === itemCode.trim().toUpperCase()) {
                console.log(`      ✓ Verified: Value correctly filled`);

                // Press Tab to confirm entry and move out of field
                await this.page.keyboard.press('Tab');
                await this.page.waitForTimeout(300);

                // Final verification after Tab
                const finalValue = await buyerPOInput.inputValue();
                if (finalValue && finalValue.trim().toUpperCase() === itemCode.trim().toUpperCase()) {
                  console.log(`      ✓ Confirmed: '${finalValue}' saved successfully`);
                  entrySuccess = true;
                } else {
                  console.log(`      ⚠️  Value lost after Tab, retrying...`);
                }
              } else {
                console.log(`      ⚠️  Value mismatch: expected '${itemCode.toUpperCase()}', got '${currentValue}'`);
                if (entryAttempt < maxRetries) {
                  console.log(`      → Retrying attempt ${entryAttempt + 1}/${maxRetries}`);
                  await this.page.waitForTimeout(400);
                }
              }
            }

            if (!entrySuccess) {
              console.log(`    ✗ Failed to confirm '${itemCode.toUpperCase()}' after ${maxRetries} attempts`);
            } else {
              console.log(`    ✓ BuyerPOItem successfully filled and confirmed`);
            }

          } catch (e) {
            console.log(`    ✗ Error filling BuyerPOItem: ${String(e).substring(0, 80)}`);
          }

          // ===== FILL PRICE =====
          if (price) {
            try {
              const priceCell = currentRow.locator('td[data-sap-ui-colid*="Price"]').first();
              const priceInput = priceCell.locator('input[type="text"]').first();
              const priceExists = await priceInput.count();

              if (priceExists === 0) {
                console.log(`    ⚠️  Price input field not found`);
              } else {
                // Click the price field to focus it
                await priceInput.click();
                await this.page.waitForTimeout(200);

                // Fill with price value
                await priceInput.fill(price);
                console.log(`    ✓ Filled Price with: '${price}'`);

                // Trigger change event by pressing Enter
                await priceInput.press('Enter');
                await this.page.waitForTimeout(500);
              }
            } catch (e) {
              console.log(`    ✗ Error filling Price: ${e}`);
            }
          }

          // Wait a bit for all changes to be saved
          await this.page.waitForTimeout(800);

          // Verify values were actually saved by checking fresh references
          try {
            // Get fresh row reference by counting from the start
            const freshAllRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody').last().locator('tr[role="row"]');
            const freshRow = freshAllRows.nth(i);

            const verifyBuyerPOInput = freshRow.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first().locator('input[role="combobox"]').first();
            const verifyPriceInput = freshRow.locator('td[data-sap-ui-colid*="Price"]').first().locator('input[type="text"]').first();

            const buyerPOValue = await verifyBuyerPOInput.inputValue();
            const priceValue = await verifyPriceInput.inputValue();

            console.log(`    ℹ️  Verification - Row ${i + 1}: BuyerPO='${buyerPOValue}', Price='${priceValue}'`);

            if (buyerPOValue && buyerPOValue.trim().toUpperCase() === itemCode.trim().toUpperCase()) {
              console.log(`    ✓ Row ${i + 1} saved successfully`);
              successCount++;
            } else {
              console.log(`    ⚠️  Row ${i + 1}: Value mismatch (expected '${itemCode.trim().toUpperCase()}', got '${buyerPOValue}')`);
            }
          } catch (e) {
            console.log(`    ✗ Row ${i + 1}: Verification error - ${String(e).substring(0, 50)}`);
          }

        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          console.log(`  ✗ Row ${i + 1}: Error - ${errorMsg.substring(0, 80)}`);
        }
      }

      console.log(`\n📊 Summary: ${successCount}/${totalRows} items filled\n`);

      console.log('╔════════════════════════════════════════════════════════════╗');
      if (totalRows === 0) {
        console.log('║ ✓ NO DATA TO PROCESS (VALID NO-OP)                        ║');
      } else if (successCount === totalRows) {
        console.log(`║ ✓ COMPLETED: ${successCount}/${totalRows} BUYER PO ITEMS FILLED          ║`);
      } else if (successCount > 0) {
        console.log(`║ ⚠️  PARTIALLY COMPLETED: ${successCount}/${totalRows} ITEMS FILLED        ║`);
      } else {
        console.log('║ ℹ️  NO ITEMS FILLED                                        ║');
      }
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return {
        allSelected: totalRows === 0 || successCount === totalRows,
        successCount,
        totalRows
      };
    } catch (e) {
      console.error('\n✗ Failed to fill Buyer PO Items:');
      console.error(e);
      throw e;
    }
  }

  // Raw Materials Methods

  async scrollToRawMaterialsSection() {
    try {
      await this.page.evaluate(() => {
        const rawMaterialsSection = document.querySelector('[id*="RawMaterials"]');
        if (rawMaterialsSection) {
          rawMaterialsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await this.page.waitForTimeout(800);
      console.log('  ✓ Scrolled to Raw Materials section');
    } catch (e) {
      console.log('  ⚠️  Could not scroll to Raw Materials section');
    }
  }

  async waitForRawMaterialsSection() {
    // Use a more flexible selector that matches the scrolling selector
    const selector = this.page.locator('[id*="RawMaterials"]');
    await selector.waitFor({ state: 'visible', timeout: 10000 });
    console.log('  ✓ Raw Materials section is visible');
  }

  async clickRawMaterialsCreateButton() {
    try {
      // First check if we're on the right page and form is loaded
      const pageTitle = await this.page.title();
      console.log(`  → Page title: ${pageTitle}`);

      // Check what sections exist on page
      const sections = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll('[id*="table"]'))
          .map(e => e.getAttribute('id'))
          .filter((id): id is string => id !== null && id.includes('::'))
          .map(id => id.split('::')[1])
          .filter(Boolean)
          .slice(0, 10);
      });
      console.log(`  → Found sections: ${sections.join(', ')}`);

      // Scroll to ensure button is visible
      await this.scrollToRawMaterialsSection();
      await this.page.waitForTimeout(1000);

      // Use JavaScript to find the Create button by searching for the ID containing the pattern
      const results = await this.page.evaluate(() => {
        // Find all elements with RawMaterials in ID
        const rawMaterials = Array.from(document.querySelectorAll('[id*="RawMaterials"]')).map(e => ({
          id: e.getAttribute('id'),
          tag: e.tagName,
          text: e.textContent?.substring(0, 50)
        }));

        // Find all elements with Create in text
        const createElements = Array.from(document.querySelectorAll('*'))
          .filter(e => e.textContent?.trim() === 'Create')
          .map(e => ({
            id: e.getAttribute('id'),
            tag: e.tagName,
            text: e.textContent
          }));

        return { rawMaterials: rawMaterials.slice(0, 5), createElements };
      });

      console.log('  → RawMaterials elements found:', results.rawMaterials.length);
      for (const elem of results.rawMaterials) {
        console.log(`    ${elem.tag}: ${elem.id}`);
      }
      console.log(`  → Create elements found: ${results.createElements.length}`);
      for (const elem of results.createElements) {
        console.log(`    ${elem.tag}: ${elem.id}`);
      }

      const buttonFound = await this.page.evaluate(() => {
        // Find any element with RawMaterials and StandardAction::Create
        const elements = document.querySelectorAll('[id*="RawMaterials"]');
        for (const elem of elements) {
          const id = elem.getAttribute('id') || '';
          if (id.includes('StandardAction::Create')) {
            return id;
          }
        }
        return null;
      });

      if (!buttonFound) {
        console.log('  → Button not found, searching by text...');

        // Try finding by text "Create" in RawMaterials section
        const createButtonFound = await this.page.evaluate(() => {
          const rawMatsec = document.querySelector('[id*="RawMaterials"]');
          if (!rawMatsec) return null;
          const createBtns = rawMatsec.querySelectorAll('*');
          for (const elem of createBtns) {
            if (elem.textContent?.trim() === 'Create') {
              return elem.getAttribute('id');
            }
          }
          return null;
        });

        if (!createButtonFound) {
          throw new Error('Raw Materials Create button not found in DOM');
        }

        // Click using the found ID
        await this.page.evaluate((id) => {
          const elem = document.getElementById(id);
          if (elem) {
            elem.scrollIntoView({ behavior: 'auto', block: 'center' });
            setTimeout(() => {
              elem.click();
            }, 300);
          }
        }, createButtonFound);
      } else {
        // Click the found button
        await this.page.evaluate((id) => {
          const elem = document.getElementById(id);
          if (elem) {
            elem.scrollIntoView({ behavior: 'auto', block: 'center' });
            setTimeout(() => {
              elem.click();
            }, 300);
          }
        }, buttonFound);
      }

      console.log('  ✓ Raw Materials Create button clicked');

      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(800);
    } catch (e) {
      console.error(`  ✗ Failed to click Raw Materials Create button: ${e}`);
      throw e;
    }
  }

  async waitForRawMaterialsTableRow() {
    try {
      // Debug: Find the actual table
      const actualTable = await this.page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table[id*="RawMaterials"]'));
        return tables.map(t => ({
          id: t.getAttribute('id'),
          rows: t.querySelectorAll('tr[role="row"]').length
        }));
      });

      console.log(`  → Found ${actualTable.length} RawMaterials tables with ${actualTable.map(t => t.rows).join(', ')} rows`);

      // Wait for the table body to exist with a longer timeout
      await this.rawMaterialsTableBody.first().waitFor({ state: 'visible', timeout: 15000 });

      // Wait for any row in the table
      const allRows = this.rawMaterialsTableBody.first().locator('tr[role="row"]');
      await allRows.first().waitFor({ state: 'visible', timeout: 15000 });

      // Extra wait for row to be fully rendered
      await this.page.waitForTimeout(1000);
      console.log('  ✓ New row detected in table');
    } catch (e) {
      console.error(`  ✗ Failed to wait for Raw Materials row: ${e}`);
      throw e;
    }
  }

  async fillRawMaterialRow(itemCode: string, itemName: string) {
    try {
      console.log(`\n  ╔═════════════════════════════════════════════════════╗`);
      console.log(`  ║ Code: ${itemCode}, Name: ${itemName}`);
      console.log(`  ╚═════════════════════════════════════════════════════╝`);

      // Get all rows from the table body
      const tableBody = this.rawMaterialsTableBody.first();
      const allRows = tableBody.locator('tr[role="row"]');
      const rowCount = await allRows.count();

      console.log(`    Total rows in table: ${rowCount}`);

      if (rowCount === 0) {
        console.error(`    ✗ No rows found in table`);
        return false;
      }

      // Get the first row (newly created one at top)
      // Find inputs using the specific aria-labelledby selectors
      const itemCodeInput = this.page.locator('input[aria-labelledby*="ItemCode-innerColumn"]').first();
      const itemNameInput = this.page.locator('input[aria-labelledby*="ItemName-innerColumn"]').first();

      // Verify inputs exist
      const codeExists = await itemCodeInput.count();
      const nameExists = await itemNameInput.count();

      if (codeExists === 0 || nameExists === 0) {
        console.error(`    ✗ Required input fields not found. Code: ${codeExists}, Name: ${nameExists}`);
        return false;
      }

      console.log(`    ✓ Found ItemCode and ItemName input fields`);

      // Scroll inputs into view
      await itemCodeInput.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);

      // Fill Item Code
      console.log(`    → Filling Item Code with "${itemCode}"...`);
      await itemCodeInput.click({ timeout: 3000 });
      await this.page.waitForTimeout(200);
      await itemCodeInput.fill(itemCode);
      await this.page.waitForTimeout(300);
      console.log(`      ✓ Code entered: ${itemCode}`);

      // Fill Item Name
      console.log(`    → Filling Item Name with "${itemName}"...`);
      await itemNameInput.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);
      await itemNameInput.click({ timeout: 3000 });
      await this.page.waitForTimeout(200);
      await itemNameInput.fill(itemName);
      await this.page.waitForTimeout(300);
      console.log(`      ✓ Name entered: ${itemName}`);

      // Verify
      const codeVal = await itemCodeInput.inputValue();
      const nameVal = await itemNameInput.inputValue();

      console.log(`    → Verification:`);
      console.log(`      Code in field: '${codeVal}'`);
      console.log(`      Name in field: '${nameVal}'`);

      if (codeVal === itemCode && nameVal === itemName) {
        console.log(`    ✓ Confirmed: Both fields filled correctly`);
        return true;
      } else {
        console.log(`    ⚠️  Mismatch in values`);
        return false;
      }
    } catch (e) {
      console.error(`    ✗ Error: ${String(e).substring(0, 100)}`);
      return false;
    }
  }

  async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║           ADDING RAW MATERIALS                            ║');
      console.log('║         (New rows added to table TOP)                     ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Scroll to Raw Materials section
      await this.scrollToRawMaterialsSection();

      // Wait for create button to be available
      await this.rawMaterialsCreateButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
        console.log('  ⚠️  Create button not found, proceeding anyway');
      });

      let successCount = 0;

      for (let i = 0; i < rawMaterials.length; i++) {
        try {
          console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);

          // Click Create button to add new row
          await this.clickRawMaterialsCreateButton();

          // Wait for new row to appear
          await this.waitForRawMaterialsTableRow();

          // Fill the newly created row
          const success = await this.fillRawMaterialRow(
            rawMaterials[i].itemCode,
            rawMaterials[i].itemName
          );

          if (success) {
            console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
            successCount++;
          } else {
            console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
          }
        } catch (e) {
          console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
        }
      }

      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return {
        successCount,
        totalRows: rawMaterials.length,
        allAdded: successCount === rawMaterials.length
      };
    } catch (e) {
      console.error('\n✗ Failed to add Raw Materials:');
      console.error(e);
      throw e;
    }
  }

  // Allocation Hierarchy Methods

  async scrollToAllocationHierarchySection() {
    try {
      await this.page.evaluate(() => {
        const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
        if (allocationSection) {
          allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await this.page.waitForTimeout(800);
      console.log('  ✓ Scrolled to Allocation Hierarchy section');
    } catch (e) {
      console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
    }
  }

  async waitForAllocationHierarchySection() {
    await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
    console.log('  ✓ Allocation Hierarchy section is visible');
  }

  async expandTreeNode(rowIndex: number) {
    try {
      const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
      const row = allRows.nth(rowIndex);

      // Find the tree icon (expand/collapse button)
      const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
      const isExpandable = await treeIcon.evaluate((el) => {
        return el.classList.contains('sapUiTableTreeIconNodeClosed');
      });

      if (isExpandable) {
        await treeIcon.click();
        await this.page.waitForTimeout(500);
        console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
        return true;
      } else {
        console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
        return false;
      }
    } catch (e) {
      console.error(`    ✗ Failed to expand node: ${e}`);
      return false;
    }
  }

  async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
    try {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      // Scroll to section
      await this.scrollToAllocationHierarchySection();
      await this.waitForAllocationHierarchySection();

      let successCount = 0;

      for (const allocation of allocations) {
        try {
          const rowIndex = allocation.rowIndex;
          const quantity = allocation.quantity;

          console.log(`  ╔═════════════════════════════════════════════════════╗`);
          console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
          console.log(`  ╚═════════════════════════════════════════════════════╝`);

          // Get fresh row reference
          const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
          const currentRow = allRows.nth(rowIndex);

          // Get the quantity input field (second column)
          const quantityInput = currentRow
            .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
            .first()
            .locator('input[type="text"]')
            .first();

          // Scroll row into view
          await currentRow.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(300);

          // Check if input exists
          const inputExists = await quantityInput.count();
          if (inputExists === 0) {
            console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
            continue;
          }

          // Wait for input to be visible
          await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

          // Click and fill the input
          await quantityInput.click();
          await this.page.waitForTimeout(150);
          await quantityInput.fill(quantity);
          console.log(`    ✓ Quantity filled: ${quantity}`);

          // Press Tab to confirm
          await this.page.keyboard.press('Tab');
          await this.page.waitForLoadState('networkidle');
          await this.page.waitForTimeout(500);

          // Verify the value was saved
          const savedValue = await quantityInput.inputValue();
          if (savedValue === quantity) {
            console.log(`    ✓ Value verified: ${savedValue}`);
            successCount++;
          } else {
            console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
          }
        } catch (e) {
          console.error(`  ✗ Error processing allocation: ${e}`);
        }
      }

      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log(`║ ✓ Quantities Filled: ${successCount}/${allocations.length}`);
      console.log('╚════════════════════════════════════════════════════════════╝\n');

      return {
        successCount,
        totalRows: allocations.length,
        allFilled: successCount === allocations.length
      };
    } catch (e) {
      console.error('\n✗ Failed to fill allocation quantities:');
      console.error(e);
      throw e;
    }
  }

  async getTreeNodeInfo() {
    try {
      console.log('\n  Retrieving Allocation Hierarchy tree structure...\n');

      const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
      const rowCount = await allRows.count();

      const treeInfo: Array<{ rowIndex: number; styleName: string; level: number; isExpandable: boolean }> = [];

      for (let i = 0; i < rowCount; i++) {
        const row = allRows.nth(i);

        // Get style code/name
        const styleCell = row.locator('td[data-sap-ui-colid*="styleTreeColName"]').first();
        const styleText = await styleCell.locator('span[class*="sapMText"]').first().textContent();

        // Get tree level (aria-level attribute)
        const level = await row.evaluate((el) => {
          const ariaLevel = el.getAttribute('aria-level');
          return ariaLevel ? parseInt(ariaLevel) : 0;
        });

        // Check if node is expandable
        const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
        const isExpandable = await treeIcon.evaluate((el) => {
          return el.classList.contains('sapUiTableTreeIconNodeClosed');
        });

        if (styleText && styleText.trim()) {
          treeInfo.push({
            rowIndex: i,
            styleName: styleText.trim(),
            level,
            isExpandable
          });
        }
      }

      console.log(`  Found ${treeInfo.length} nodes in tree:\n`);
      treeInfo.forEach((node) => {
        const indent = '  '.repeat(node.level);
        const expandIcon = node.isExpandable ? '▶️ ' : '•';
        console.log(`  ${indent}${expandIcon} [${node.rowIndex}] ${node.styleName} (Level: ${node.level})`);
      });
      console.log();

      return treeInfo;
    } catch (e) {
      console.error('  ✗ Failed to get tree node info:', e);
      return [];
    }
  }
}
