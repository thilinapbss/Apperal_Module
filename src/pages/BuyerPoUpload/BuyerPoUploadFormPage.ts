import { Page, Locator } from '@playwright/test';

export class BuyerPoUploadFormPage {
  readonly page: Page;

  readonly formContainer: Locator;
  readonly formTitle: Locator;
  readonly submitButton: Locator;
  readonly saveButton: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly excelUploadButton: Locator;
  readonly fileInput: Locator;
  readonly buyerInput: Locator;
  readonly styleNoInput: Locator;
  readonly styleDescriptionInput: Locator;
  readonly styleColorInput: Locator;
  readonly seasonInput: Locator;
  readonly poDateInput: Locator;
  readonly kimbleNoInput: Locator;
  readonly remarkInput: Locator;
  readonly currencyInput: Locator;
  readonly currencyValueHelpButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly supplierCodeValueHelpButton: Locator;
  readonly supplierCodeInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form selectors - update based on actual form structure
    this.formContainer = page.locator('form, [role="main"]').first();
    this.formTitle = page.locator('h1, h2').filter({ hasText: /Buyer.*PO|Create/ }).first();
    this.submitButton = page.locator('button:has-text("Submit"), button[type="submit"]').first();
    this.saveButton = page.locator('button:has-text("Save")').first();
    this.createButton = page.locator('button[id*="StandardAction::Save"], button:has-text("Create")').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
    // Excel upload button - look for button with "Excel Upload" text
    this.excelUploadButton = page.locator('button').filter({ hasText: 'Excel Upload' }).first();
    this.fileInput = page.locator('input[type="file"]');

    // Input field selectors - matching actual SAP UI5 form structure
    this.buyerInput = page.locator('input[id*="Buyer::Field-edit-inner"]').first();
    this.styleNoInput = page.locator('input[id*="StyleNo::Field-edit-inner"]').first();
    this.styleDescriptionInput = page.locator('input[id*="StyleDescription::Field-edit-inner"]').first();
    this.styleColorInput = page.locator('input[id*="StyleColor::Field-edit-inner"]').first();
    this.seasonInput = page.locator('input[id*="Season::Field-edit-inner"]').first();
    this.poDateInput = page.locator('input[id*="::PODate::Field-edit-inner"]').first();
    this.kimbleNoInput = page.locator('input[id*="::KimbleNo::Field-edit-inner"]').first();
    this.remarkInput = page.locator('input[id*="Remark::Field-edit-inner"]').first();
    this.currencyInput = page.locator('input[id*="Currency::Field-edit-inner"]:not([id*="-vhi"])').first();
    this.currencyValueHelpButton = page.locator('[id*="Currency::Field-edit-inner-vhi"][aria-label="Show Value Help"]').first();

    this.successMessage = page.locator('[role="alert"]').filter({ hasText: /success|saved|created|uploaded/i }).first();
    this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i }).first();

    // Value help button and input for Supplier Code field
    this.supplierCodeValueHelpButton = page.locator('[id*="SupplierCode::Field-edit-inner-vhi"][aria-label="Show Value Help"]').first();
    this.supplierCodeInput = page.locator('input[id*="SupplierCode::Field-edit-inner"]:not([id*="-vhi"])').first();
  }

  async waitForFormLoad() {
    await this.formContainer.waitFor({ state: 'visible', timeout: 90000 });
  }

  async fillFormField(fieldName: string, value: string) {
    const input = this.page.locator(`input[name*="${fieldName}"], input[aria-label*="${fieldName}"], input[placeholder*="${fieldName}"]`).first();
    await input.fill(value);
  }

  async uploadExcelFile(filePath: string) {
    try {
      console.log(`Attempting to upload file: ${filePath}`);

      // Wait for page to fully load and busy indicators to disappear
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);

      // Wait for any busy/loading indicators to disappear
      const busyIndicators = this.page.locator('.sapUiBlockLayer, .sapUiLocalBusyIndicator, [class*="busy"]');
      const busyCount = await busyIndicators.count();
      if (busyCount > 0) {
        console.log(`Waiting for ${busyCount} busy indicators to disappear...`);
        await this.page.waitForSelector('.sapUiBlockLayer, .sapUiLocalBusyIndicator', { state: 'hidden', timeout: 30000 }).catch(() => {
          console.log('Busy indicator wait timed out, proceeding anyway');
        });
        await this.page.waitForTimeout(500);
      }

      // Set up file chooser listener BEFORE clicking
      const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 20000 }).catch(err => {
        console.log('File chooser timeout:', err.message);
        return null;
      });

      // Click the Excel Upload button
      console.log('Clicking Excel Upload button');
      await this.excelUploadButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.excelUploadButton.click({ force: true, timeout: 10000 });
      console.log('✓ Excel Upload button clicked');

      // Wait for file chooser
      const fileChooser = await fileChooserPromise;

      if (fileChooser) {
        console.log('File chooser triggered, setting files');
        await fileChooser.setFiles(filePath);
        console.log('✓ File uploaded successfully');

        // Wait for file to be processed
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
      } else {
        throw new Error('File chooser dialog did not appear after clicking Excel Upload button');
      }
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
      throw error;
    }
  }

  async clickExcelUploadButton() {
    // Just click the button, file upload is handled in uploadExcelFile
    await this.excelUploadButton.click();
  }

  async isExcelUploadButtonVisible(): Promise<boolean> {
    return await this.excelUploadButton.isVisible();
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickSaveCreateButton() {
    const saveButton = this.page.locator('[id*="FooterBar::StandardAction::Save"]').first();
    await saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await saveButton.click();
    console.log('✓ Clicked Save/Create button');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async clickSupplierCodeValueHelpButton() {
    await this.supplierCodeValueHelpButton.click();
  }

  private async waitForSupplierDialogToClose() {
    // Wait for the SAP UI5 supplier value help dialog to fully detach from the DOM.
    // waitForLoadState('networkidle') is not sufficient — the dialog's sap-ui-static
    // overlay stays in the DOM and blocks pointer events until it is fully removed.
    try {
      await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"]', {
        state: 'detached',
        timeout: 15000,
      });
    } catch {
      await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });
    }
    // Allow SAP UI5 to finish re-rendering after dialog removal.
    await this.page.waitForTimeout(800);
  }

  async selectFirstSupplierFromValueHelpList() {
    await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Wait for the first data row to be rendered and not in a loading/overlay state.
    const firstCell = this.page.locator(
      '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex="0"] td'
    ).first();
    await firstCell.waitFor({ state: 'visible', timeout: 10000 });
    await firstCell.click();

    // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
    const dialog = this.page.locator('[role="dialog"]').first();
    if (await dialog.isVisible()) {
      const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
      if (await okButton.isVisible()) {
        await okButton.click();
      }
    }

    await this.waitForSupplierDialogToClose();
  }

  async selectSupplierByCode(supplierCode: string) {
    await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Wait for table rows to be rendered.
    await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]', {
      timeout: 10000,
    });

    const tableRows = await this.page.locator(
      '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]'
    ).all();
    let found = false;

    for (const row of tableRows) {
      const rowText = await row.textContent();
      if (rowText && rowText.includes(supplierCode)) {
        await row.locator('td').first().click();
        console.log(`Clicked on supplier row: ${supplierCode}`);
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Supplier with code "${supplierCode}" not found in value help table`);
    }

    // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
    const dialog = this.page.locator('[role="dialog"]').first();
    if (await dialog.isVisible()) {
      const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
      if (await okButton.isVisible()) {
        await okButton.click();
      }
    }

    await this.waitForSupplierDialogToClose();
  }

  async enterPODate(date: string) {
    // Clear any existing value and enter new date
    await this.poDateInput.fill('');
    await this.poDateInput.fill(date);
    await this.poDateInput.press('Enter');
  }

  async selectTodayFromCalendar() {
    // Click on the calendar/picker icon to open the date picker
    const calendarIcon = this.page.locator('[id*="PODate::Field-edit-icon"]').first();
    await calendarIcon.click();
    console.log('✓ Opened calendar picker');

    await this.page.waitForTimeout(500);

    const allTodayButtons = await this.page.locator('[class*="sapUiCalItemNow"]').all();
    for (const btn of allTodayButtons) {
      if (await btn.isVisible()) {
        await btn.click();
        break;
      }
    }
    console.log('✓ Selected today from calendar');

    await this.page.waitForTimeout(500);
  }

  async getPODateValue(): Promise<string> {
    return await this.poDateInput.inputValue();
  }

  async enterKimbleNo(kimbleNo: string) {
    await this.kimbleNoInput.fill(kimbleNo);
  }

  async getKimbleNoValue(): Promise<string> {
    return await this.kimbleNoInput.inputValue();
  }

  private async selectTodayInDateCell(cell: Locator) {
    // Click the input first so SAP UI5 renders the calendar icon in the cell.
    const input = cell.locator('input').first();
    await input.click();

    const calendarIcon = cell.locator('.sapMInputBaseIcon, [aria-label="Open Picker"]').first();
    await calendarIcon.waitFor({ state: 'visible', timeout: 5000 });
    await calendarIcon.click();

    // Multiple sapUiCalItemNow elements may exist in the DOM simultaneously
    // (e.g. the PODate calendar stays rendered but hidden). .first() would
    // resolve to the hidden one. Instead, iterate and click the visible one.
    await this.page.waitForTimeout(300);
    const allTodayButtons = await this.page.locator('[class*="sapUiCalItemNow"]').all();
    let clicked = false;
    for (const btn of allTodayButtons) {
      if (await btn.isVisible()) {
        await btn.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      throw new Error('Could not find a visible today button in the date cell calendar');
    }

    await this.page.waitForTimeout(300);
  }

  private generateUniqueDeliveryNo(rowIndex: number): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const sequence = String(rowIndex + 1).padStart(3, '0');

    // Format: DLV-MMDD-HHMM-XXX (max 18 characters to stay within 20 char limit)
    return `DLV-${month}${day}-${hours}${minutes}-${sequence}`;
  }

  async fillLineItemDetailsInTable(lineItems: Array<{ deliveryDate: string; pcdDate: string; fobDate: string }>): Promise<void> {
    // Wait for the Details table to be visible
    const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
    await this.page.waitForSelector(tableSelector, { timeout: 10000 });

    // Get all table rows
    const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();

    console.log(`\n📋 Filling date details for ${Math.min(lineItems.length, tableRows.length)} line items from test-data.json`);

    for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
      const cells = await tableRows[i].locator('[role="gridcell"]').all();
      const lineItem = lineItems[i];

      // Generate unique delivery number with date and time
      const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);

      // Column 5: DeliveryNo (auto-generated with date and time)
      if (cells.length > 5) {
        const deliveryNoInput = cells[5].locator('input').first();
        await deliveryNoInput.fill(uniqueDeliveryNo);
        await deliveryNoInput.press('Tab');
        console.log(`  ✓ Row ${i + 1}: DeliveryNo = "${uniqueDeliveryNo}"`);
        await this.page.waitForTimeout(300);
      }

      // Column 6: DeliveryDate (from test-data.json)
      if (cells.length > 6 && lineItem.deliveryDate) {
        await this.fillDateInputField(cells[6], lineItem.deliveryDate);
        console.log(`  ✓ Row ${i + 1}: DeliveryDate = "${lineItem.deliveryDate}"`);
      }

      // Column 7: PCD_Date (from test-data.json)
      if (cells.length > 7 && lineItem.pcdDate) {
        await this.fillDateInputField(cells[7], lineItem.pcdDate);
        console.log(`  ✓ Row ${i + 1}: PCD_Date = "${lineItem.pcdDate}"`);
      }

      // Column 8: FOB_Date (from test-data.json)
      if (cells.length > 8 && lineItem.fobDate) {
        await this.fillDateInputField(cells[8], lineItem.fobDate);
        console.log(`  ✓ Row ${i + 1}: FOB_Date = "${lineItem.fobDate}"`);
      }
    }

    console.log('✓ All line item date details filled in\n');
  }

  private async fillDateInputField(cell: Locator, dateString: string): Promise<void> {
    // Click the input to activate the date field
    const input = cell.locator('input').first();
    await input.click();
    await this.page.waitForTimeout(300);

    // Type the date directly into the input field
    // Format: e.g., "01 Jun 2026" or "2026-06-01"
    await input.fill(dateString);
    await input.press('Enter');
    await this.page.waitForTimeout(300);
  }

  async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
    // Wait for the Details table to be visible
    const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
    await this.page.waitForSelector(tableSelector, { timeout: 10000 });

    // Read expected row count from table title span
    const titleSpan = this.page.locator('[id*="Details1-title-inner"]');
    const titleText = await titleSpan.textContent();
    const rowCountMatch = titleText?.match(/\((\d+)\)/);
    const expectedRowCount = rowCountMatch ? parseInt(rowCountMatch[1]) : 0;

    // Click clear selection icon (soft click) to clear any current selection
    const clearIcon = this.page.locator('#__icon5').first();
    await clearIcon.click({ delay: 100, timeout: 5000, force: false });
    await this.page.waitForTimeout(500);

    console.log(`\n📊 ===== LINE ITEMS CAPTURE =====`);
    console.log(`📌 Table Title: ${titleText}`);
    console.log(`📌 Expected rows: ${expectedRowCount}`);
    console.log(`📌 Table selection cleared\n`);

    // Works in both edit mode (input elements) and display mode (span text) after save.
    const getCellValue = async (cell: Locator): Promise<string> => {
      const inputCount = await cell.locator('input').count();
      if (inputCount > 0) {
        try {
          return await cell.locator('input').first().inputValue();
        } catch {
          return (await cell.locator('input').first().getAttribute('value')) ?? '';
        }
      }
      return (await cell.textContent())?.trim() ?? '';
    };

    const tableData: Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }> = [];

    // Capture rows line by line: Press ArrowDown, wait, capture each visible row
    console.log(`🔄 Capturing rows line by line (ArrowDown → Capture all visible):\n`);

    for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
      // Press Down arrow key once to move to next row
      console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Pressing Down arrow key...`);
      await this.page.keyboard.press('ArrowDown');
      await this.page.waitForTimeout(500);

      // Wait 3 seconds for row to render and load
      console.log(`⏳ Waiting 3 seconds for row to load...`);
      await this.page.waitForTimeout(3000);

      // Get ALL visible rows after ArrowDown
      const allTableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();

      console.log(`   Found ${allTableRows.length} visible rows, capturing new ones...\n`);

      // Capture all visible rows and add only NEW unique ones
      for (let i = 0; i < allTableRows.length; i++) {
        const row = allTableRows[i];
        const cells = await row.locator('[role="gridcell"]').all();

        if (cells.length > 0) {
          const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
          const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
          const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
          const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
          const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
          const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
          const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
          const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
          const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';

          // Check if this row already exists in tableData
          const isDuplicate = tableData.some(
            r => r.poNo === poNo && r.countryCode === countryCode && r.partNo === partNo && r.qty === qty
          );

          // Capture row with any data if it's new
          if ((poNo || partNo || qty || total || countryCode) && !isDuplicate) {
            tableData.push({
              poNo: poNo?.trim() || '',
              countryCode: countryCode?.trim() || '',
              partNo: partNo?.trim() || '',
              qty: qty?.trim() || '',
              total: total?.trim() || '',
              deliveryNo: deliveryNo?.trim() || '',
              deliveryDate: deliveryDate?.trim() || '',
              pcdDate: pcdDate?.trim() || '',
              fobDate: fobDate?.trim() || ''
            });
            console.log(`   ✓ New Row ${tableData.length}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
          }
        }
      }
    }

    console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
    console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);

    if (tableData.length === expectedRowCount) {
      console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
    } else if (tableData.length > 0) {
      console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
      console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
    } else {
      console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
    }

    console.log(`\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
    console.log(`📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
    console.log(`════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);

    console.log(`\nRow # | PO No        | Country | Part No    | Qty        | Total      | Delivery No     | Delivery Date   | PCD Date        | FOB Date`);
    console.log(`──────┼──────────────┼─────────┼────────────┼────────────┼────────────┼─────────────────┼─────────────────┼─────────────────┼──────────────`);

    tableData.forEach((row, index) => {
      const rowNum = (index + 1).toString().padEnd(4);
      const poNo = row.poNo.padEnd(12);
      const country = row.countryCode.padEnd(7);
      const partNo = row.partNo.padEnd(10);
      const qty = row.qty.padEnd(10);
      const total = row.total.padEnd(10);
      const deliveryNo = row.deliveryNo.padEnd(15);
      const deliveryDate = row.deliveryDate.padEnd(15);
      const pcdDate = row.pcdDate.padEnd(15);
      const fobDate = row.fobDate.padEnd(10);

      console.log(`${rowNum} | ${poNo} | ${country} | ${partNo} | ${qty} | ${total} | ${deliveryNo} | ${deliveryDate} | ${pcdDate} | ${fobDate}`);
    });

    console.log(`════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);

    console.log(`\n✓ Line Items Summary:`);
    console.log(`  • Total Rows Captured: ${tableData.length}`);
    console.log(`  • Expected Rows: ${expectedRowCount}`);
    console.log(`  • Status: ${tableData.length === expectedRowCount ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
    console.log(``);

    // Throw error if we didn't get all expected rows
    if (tableData.length !== expectedRowCount) {
      throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
    }

    return tableData;
  }

  async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
    // Wait for the Details table to be visible
    const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
    await this.page.waitForSelector(tableSelector, { timeout: 10000 });

    // Get all table rows in the Details table
    const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
    const tableData = [];

    console.log(`Found ${tableRows.length} rows in Details table`);

    for (let i = 0; i < tableRows.length; i++) {
      // Get cells in the current row
      const cells = await tableRows[i].locator('[role="gridcell"]').all();

      if (cells.length >= 5) {
        const getCellValue = async (cell: Locator): Promise<string> => {
          const inputCount = await cell.locator('input').count();
          if (inputCount > 0) {
            try {
              return await cell.locator('input').first().inputValue();
            } catch {
              return (await cell.locator('input').first().getAttribute('value')) ?? '';
            }
          }
          return (await cell.textContent())?.trim() ?? '';
        };

        const poNo        = await getCellValue(cells[0]);
        const countryCode = await getCellValue(cells[1]);
        const partNo      = await getCellValue(cells[2]);
        const qty         = await getCellValue(cells[3]);
        const total       = await getCellValue(cells[4]);

        tableData.push({
          poNo: poNo?.trim() || '',
          countryCode: countryCode?.trim() || '',
          partNo: partNo?.trim() || '',
          qty: qty?.trim() || '',
          total: total?.trim() || ''
        });

        console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
      }
    }

    return tableData;
  }

  async waitForSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  // Helper method to safely get field value with fallbacks
  private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
    try {
      const count = await locator.count();
      if (count === 0) {
        console.log(`Field "${fieldName}" not found with selector`);
        return '';
      }

      // Try inputValue() first (works for input elements)
      try {
        const value = await locator.inputValue();
        if (value) {
          console.log(`${fieldName} value (via inputValue): "${value}"`);
          return value;
        }
      } catch (e) {
        console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
      }

      // Fallback to getAttribute('value')
      const attrValue = await locator.getAttribute('value');
      if (attrValue) {
        console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
        return attrValue;
      }

      // Fallback to textContent for read-only fields
      const textValue = await locator.textContent();
      if (textValue) {
        console.log(`${fieldName} value (via textContent): "${textValue}"`);
        return textValue.trim();
      }

      console.log(`No value found for ${fieldName}`);
      return '';
    } catch (error) {
      console.log(`Error getting ${fieldName} value: ${error}`);
      return '';
    }
  }

  // Verification methods for data fields
  async getBuyerValue(): Promise<string> {
    return await this.getFieldValue(this.buyerInput, 'Buyer');
  }

  async getStyleNoValue(): Promise<string> {
    return await this.getFieldValue(this.styleNoInput, 'StyleNo');
  }

  async getStyleDescriptionValue(): Promise<string> {
    return await this.getFieldValue(this.styleDescriptionInput, 'StyleDescription');
  }

  async getStyleColorValue(): Promise<string> {
    return await this.getFieldValue(this.styleColorInput, 'StyleColor');
  }

  async getSeasonValue(): Promise<string> {
    return await this.getFieldValue(this.seasonInput, 'Season');
  }

  async enterRemark(remark: string) {
    await this.remarkInput.fill(remark);
  }

  async getRemarkValue(): Promise<string> {
    return await this.getFieldValue(this.remarkInput, 'Remark');
  }

  async selectCurrency(currencyCode: string): Promise<void> {
    try {
      console.log(`📝 Selecting currency: ${currencyCode}`);

      // Click the currency value help button to open dialog
      await this.currencyValueHelpButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.currencyValueHelpButton.click({ force: true });
      await this.page.waitForTimeout(1000);

      // Wait for dialog to appear
      await this.page.waitForSelector('[role="dialog"]', { timeout: 5000 });

      // Find the currency code in the table - look for cells containing the currency code
      const currencyText = this.page.locator('span').filter({ hasText: currencyCode });
      const matches = await currencyText.count();

      if (matches > 0) {
        // Click the first matching currency code
        await currencyText.first().click();
        console.log(`✓ Selected currency: ${currencyCode}`);
      } else {
        // Try search if direct match fails
        const searchInput = this.page.locator('input[placeholder="Search"]').first();
        await searchInput.fill(currencyCode);
        await this.page.waitForTimeout(500);

        const firstMatch = this.page.locator('span').filter({ hasText: currencyCode }).first();
        await firstMatch.click();
        console.log(`✓ Selected currency via search: ${currencyCode}`);
      }

      await this.page.waitForTimeout(500);
    } catch (error) {
      console.log(`⚠ Error during currency selection: ${error}`);
    }
  }

  async getCurrencyValue(): Promise<string> {
    return await this.getFieldValue(this.currencyInput, 'Currency');
  }

  async verifyDataLoaded(expectedData: { buyer?: string; styleNo?: string; styleDescription?: string; styleColor?: string; season?: string }): Promise<boolean> {
    try {
      if (expectedData.buyer) {
        const buyerValue = await this.getBuyerValue();
        if (buyerValue !== expectedData.buyer) {
          console.log(`Buyer mismatch: expected "${expectedData.buyer}", got "${buyerValue}"`);
          return false;
        }
      }

      if (expectedData.styleNo) {
        const styleNoValue = await this.getStyleNoValue();
        if (styleNoValue !== expectedData.styleNo) {
          console.log(`Style No mismatch: expected "${expectedData.styleNo}", got "${styleNoValue}"`);
          return false;
        }
      }

      if (expectedData.styleDescription) {
        const styleDescValue = await this.getStyleDescriptionValue();
        if (styleDescValue !== expectedData.styleDescription) {
          console.log(`Style Description mismatch: expected "${expectedData.styleDescription}", got "${styleDescValue}"`);
          return false;
        }
      }

      if (expectedData.styleColor) {
        const styleColorValue = await this.getStyleColorValue();
        if (styleColorValue !== expectedData.styleColor) {
          console.log(`Style Color mismatch: expected "${expectedData.styleColor}", got "${styleColorValue}"`);
          return false;
        }
      }

      if (expectedData.season) {
        const seasonValue = await this.getSeasonValue();
        if (seasonValue !== expectedData.season) {
          console.log(`Season mismatch: expected "${expectedData.season}", got "${seasonValue}"`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log(`Error verifying data: ${error}`);
      return false;
    }
  }

  async getSupplierCodeValue(): Promise<string> {
    return await this.getFieldValue(this.supplierCodeInput, 'SupplierCode');
  }

  async captureAllFormData(): Promise<{
    capturedAt: string;
    header: Record<string, string>;
    lineItems: Array<Record<string, string>>;
  }> {
    const header: Record<string, string> = {
      buyer:            await this.getBuyerValue(),
      styleNo:          await this.getStyleNoValue(),
      styleDescription: await this.getStyleDescriptionValue(),
      styleColor:       await this.getStyleColorValue(),
      season:           await this.getSeasonValue(),
      supplierCode:     await this.getSupplierCodeValue(),
      poDate:           await this.getPODateValue(),
      kimbleNo:         await this.getKimbleNoValue(),
      remark:           await this.getRemarkValue(),
      currency:         await this.getCurrencyValue(),
    };

    const lineItems = await this.captureLineItemsWithAllDetails();

    return {
      capturedAt: new Date().toISOString(),
      header,
      lineItems,
    };
  }

  async navigateBackToList() {
    const backButton = this.page.locator('[aria-label="Back"], [title="Back"]').first();
    await backButton.click();
    await this.page.waitForSelector(
      '[id*="BuyerPoUploadHeaderList"][id*="LineItem-innerTable-listUl"]',
      { timeout: 15000 }
    );
    await this.page.waitForLoadState('networkidle');
    // Allow SAP UI5 to finish rendering row data after navigation.
    await this.page.waitForTimeout(1500);
    console.log('✓ Navigated back to list page');
  }

  async verifyRecordInListTable(expected: {
    supplierCode?: string;
    poDate?: string;
    styleNo?: string;
    season?: string;
  }): Promise<{ found: boolean; matchCount: number; totalRows: number }> {
    const tableSelector = '[id*="BuyerPoUploadHeaderList"][id*="LineItem-innerTable-listUl"]';
    await this.page.waitForSelector(tableSelector, { timeout: 15000 });

    const rows = await this.page.locator(`${tableSelector} tbody tr[role="row"]`).all();
    const totalRows = rows.length;
    let matchCount = 0;

    // Read text directly from the td cell (works regardless of inner span class).
    const getCellText = async (row: Locator, columnKey: string): Promise<string> => {
      const cell = row.locator(`[data-sap-ui-column*="${columnKey}-innerColumn"]`);
      if (await cell.count() === 0) return '';
      return (await cell.textContent())?.trim() ?? '';
    };

    for (const row of rows) {
      const supplierText = await getCellText(row, 'SupplierCode');
      const poDateText   = await getCellText(row, 'PODate');
      const styleNoText  = await getCellText(row, 'StyleNo');
      const seasonText   = await getCellText(row, 'Season');

      const matches =
        (!expected.supplierCode || supplierText?.includes(expected.supplierCode)) &&
        (!expected.poDate       || poDateText?.includes(expected.poDate)) &&
        (!expected.styleNo      || styleNoText?.includes(expected.styleNo)) &&
        (!expected.season       || seasonText?.includes(expected.season));

      if (matches) {
        matchCount++;
        console.log(`  [Match ${matchCount}] Supplier: ${supplierText} | PO Date: ${poDateText} | Style No: ${styleNoText} | Season: ${seasonText}`);
      }
    }

    if (matchCount > 0) {
      console.log(`✓ Found ${matchCount} matching row(s) out of ${totalRows} total rows in list`);
    } else {
      console.log(`✗ No matching record found out of ${totalRows} rows. Expected:`, expected);
    }

    return { found: matchCount > 0, matchCount, totalRows };
  }

  async waitForToastAlert(timeout: number = 10000): Promise<string> {
    const alertLocator = this.page.locator('.sapMMessageToast[role="alert"]');
    await alertLocator.waitFor({ state: 'visible', timeout });
    const alertText = await alertLocator.textContent();
    console.log(`✓ Alert displayed: "${alertText?.trim()}"`);
    return alertText?.trim() || '';
  }

  async verifyToastAlert(expectedText: string, timeout: number = 10000): Promise<boolean> {
    const alertText = await this.waitForToastAlert(timeout);
    const matches = alertText.includes(expectedText);
    if (matches) {
      console.log(`✓ Alert verified: "${alertText}"`);
    } else {
      console.log(`✗ Alert text mismatch. Expected: "${expectedText}", Got: "${alertText}"`);
    }
    return matches;
  }

  async capturePOSizeBreakdownTable(): Promise<Array<{ poNo: string; size: string; quantity: string; amount: string }>> {
    let tableRows: any[] = [];
    let foundVia = '';

    // Strategy 1: Try SizeBreakdown selector
    let tableSelector = '[id*="SizeBreakdown"][role="grid"]';
    let matches = await this.page.locator(tableSelector).count();
    if (matches > 0) {
      tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
      foundVia = 'SizeBreakdown selector';
    }

    // Strategy 2: Try Details2
    if (tableRows.length === 0) {
      tableSelector = '[id*="Details2"][role="grid"]';
      matches = await this.page.locator(tableSelector).count();
      if (matches > 0) {
        tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
        foundVia = 'Details2 selector';
      }
    }

    // Strategy 3: Get all grids and check each one
    if (tableRows.length === 0) {
      const allGrids = await this.page.locator('[role="grid"]').all();
      console.log(`Found ${allGrids.length} total grids on page`);

      for (let i = 1; i < allGrids.length; i++) {
        const gridRows = await allGrids[i].locator('tbody tr[role="row"][data-sap-ui-rowindex]').all();
        console.log(`Grid ${i}: ${gridRows.length} rows`);
        if (gridRows.length > 0) {
          tableRows = gridRows;
          foundVia = `Grid index ${i}`;
          break;
        }
      }
    }

    if (tableRows.length > 0) {
      console.log(`✓ Size Breakdown table found via: ${foundVia}`);
    } else {
      console.log('⚠ Size Breakdown table not found - will return empty array');
    }

    // Scroll table to ensure all rows are loaded
    const tableElement = this.page.locator(tableSelector).first();
    await tableElement.evaluate(el => {
      const tbody = el.querySelector('tbody');
      if (tbody) {
        tbody.scrollTop = tbody.scrollHeight;
      }
    }).catch(() => {
      console.log('Could not scroll table, proceeding with available rows');
    });
    await this.page.waitForTimeout(500);

    // Re-fetch rows after scrolling
    tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();

    const tableData = [];
    console.log(`Found ${tableRows.length} rows from PO Size Breakdown table, capturing all...`);

    for (let i = 0; i < tableRows.length; i++) {
      const cells = await tableRows[i].locator('[role="gridcell"]').all();

      if (cells.length >= 4) {
        const getCellValue = async (cell: Locator): Promise<string> => {
          const inputCount = await cell.locator('input').count();
          if (inputCount > 0) {
            try {
              return await cell.locator('input').first().inputValue();
            } catch {
              return (await cell.locator('input').first().getAttribute('value')) ?? '';
            }
          }
          return (await cell.textContent())?.trim() ?? '';
        };

        const poNo     = await getCellValue(cells[0]);
        const size     = await getCellValue(cells[1]);
        const quantity = await getCellValue(cells[2]);
        const amount   = await getCellValue(cells[3]);

        // Capture all rows including total rows (which may have empty poNo/size)
        if (poNo || size || quantity || amount) {
          tableData.push({
            poNo: poNo?.trim() || '',
            size: size?.trim() || '',
            quantity: quantity?.trim() || '',
            amount: amount?.trim() || ''
          });
        }
      }
    }

    if (tableData.length > 0) {
      console.log(`✓ PO Size Breakdown table captured: ${tableData.length} rows`);
    } else {
      console.log('⚠ PO Size Breakdown table is empty or not found');
    }

    return tableData;
  }

  async capturePivotTable(): Promise<Array<Record<string, string>>> {
    // Wait for file upload to complete - check for busy indicators
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);

    // Find pivot table - dynamically created based on Excel data
    const tableSelector = '[id*="pivotGridTable"]';

    // Detailed diagnostics
    console.log('\n🔍 ===== PIVOT TABLE DIAGNOSTICS =====');

    // Check if PO Size Breakdown section exists
    const blockExists = await this.page.locator('[id*="PivotSection"]').count();
    console.log(`1. PivotSection blocks found: ${blockExists}`);

    // Check for pivotGridTable
    const tableCount = await this.page.locator(tableSelector).count();
    console.log(`2. pivotGridTable elements found: ${tableCount}`);

    // Check for any tables with "Pivot" in ID
    const pivotElements = await this.page.locator('[id*="pivot"]').all();
    console.log(`3. All elements with 'pivot' in ID: ${pivotElements.length}`);
    for (let i = 0; i < Math.min(5, pivotElements.length); i++) {
      const id = await pivotElements[i].getAttribute('id');
      console.log(`   - ${id}`);
    }

    // Check for data in the table
    const tableDataRows = await this.page.locator(`${tableSelector}-table tbody tr[role="row"]`).all();
    console.log(`4. Table rows found: ${tableDataRows.length}`);

    // Check if table has "No data" message
    const noDataMsg = await this.page.locator(`${tableSelector}-noDataMsg`).isVisible().catch(() => false);
    console.log(`5. "No data" message visible: ${noDataMsg}`);

    // Check the HTML structure around pivot table
    const pivotBox = await this.page.locator('[id*="pivotTableBox"]').isVisible().catch(() => false);
    console.log(`6. Pivot table box visible: ${pivotBox}`);

    const pivotTitle = await this.page.locator('[id*="pivotTableTitle"]').textContent().catch(() => 'not found');
    console.log(`7. Pivot table title: ${pivotTitle}`);

    console.log('=====================================\n');

    try {
      // Wait for table to exist
      await this.page.waitForSelector(tableSelector, { timeout: 15000 });
    } catch (e) {
      console.log('⚠ Pivot table (PO Size Breakdown) not found after waiting');
      return [];
    }

    // Get column headers dynamically (from header row)
    const headerCells = await this.page.locator(`${tableSelector}-header tbody tr td`).all();
    const columns: string[] = [];

    console.log(`Found ${headerCells.length} header cells`);

    for (let i = 0; i < headerCells.length; i++) {
      const headerText = await headerCells[i].locator('span').first().textContent();
      if (headerText) {
        columns.push(headerText.trim());
      }
    }

    console.log(`✓ Found ${columns.length} dynamic columns: ${columns.join(', ')}`);

    // Get all data rows - include both visible and potentially hidden rows
    let tableRows = await this.page.locator(
      `${tableSelector}-table tbody tr[role="row"]`
    ).all();

    console.log(`Found ${tableRows.length} total rows (including hidden)`);

    // Filter out rows that are completely hidden or contain only zeros
    const tableData: Array<Record<string, string>> = [];

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];

      // Skip rows with sapUiTableRowHidden class
      const isHidden = await row.evaluate(el => el.classList.contains('sapUiTableRowHidden'));
      if (isHidden) {
        console.log(`Skipping row ${i} - hidden`);
        continue;
      }

      const cells = await row.locator('[role="gridcell"]').all();
      const rowData: Record<string, string> = {};

      // Capture cells dynamically based on actual columns
      for (let j = 0; j < Math.min(cells.length, columns.length); j++) {
        const cellText = await cells[j].locator('span').first().textContent();
        rowData[columns[j]] = cellText?.trim() || '';
      }

      // Only add rows with some data (not all zeros or empty)
      const hasData = Object.values(rowData).some(v => v && v !== '0' && v !== '');
      if (hasData) {
        tableData.push(rowData);
        console.log(`Row ${i}: ${JSON.stringify(rowData)}`);
      }
    }

    console.log('\n📊 ===== PIVOT TABLE DATA =====');
    console.log(JSON.stringify(tableData, null, 2));
    console.log('==============================\n');

    if (tableData.length > 0) {
      console.log(`✓ Pivot table captured: ${tableData.length} rows with ${columns.length} columns`);
    } else {
      console.log('⚠ Pivot table is empty or all rows contain zeros');
    }

    return tableData;
  }
}
