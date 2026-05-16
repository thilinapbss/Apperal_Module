import { Page, Locator } from '@playwright/test';

export class BuyerPoUploadFormPage {
  readonly page: Page;

  readonly formContainer: Locator;
  readonly formTitle: Locator;
  readonly submitButton: Locator;
  readonly saveButton: Locator;
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

      // Wait for the Excel Upload button and set up file chooser listener
      const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 15000 }).catch(err => {
        console.log('File chooser timeout:', err.message);
        return null;
      });

      // Click the Excel Upload button
      console.log('Clicking Excel Upload button');
      await this.excelUploadButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.excelUploadButton.click();

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

    console.log(`Filling details for ${Math.min(lineItems.length, tableRows.length)} line items in table`);

    for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
      const cells = await tableRows[i].locator('[role="gridcell"]').all();

      // Generate unique delivery number with date and time
      const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);

      // Column 5: DeliveryNo (auto-generated with date and time)
      if (cells.length > 5) {
        const deliveryNoInput = cells[5].locator('input').first();
        await deliveryNoInput.fill(uniqueDeliveryNo);
        await deliveryNoInput.press('Tab');
        console.log(`✓ Row ${i}: DeliveryNo = "${uniqueDeliveryNo}"`);
        await this.page.waitForTimeout(300);
      }

      // Column 6: DeliveryDate
      if (cells.length > 6) {
        await this.selectTodayInDateCell(cells[6]);
        console.log(`✓ Row ${i}: DeliveryDate = today`);
      }

      // Column 7: PCD_Date
      if (cells.length > 7) {
        await this.selectTodayInDateCell(cells[7]);
        console.log(`✓ Row ${i}: PCD_Date = today`);
      }

      // Column 8: FOB_Date
      if (cells.length > 8) {
        await this.selectTodayInDateCell(cells[8]);
        console.log(`✓ Row ${i}: FOB_Date = today`);
      }
    }

    console.log('✓ All line item details filled in');
  }

  async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
    // Wait for the Details table to be visible
    const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
    await this.page.waitForSelector(tableSelector, { timeout: 10000 });

    // Get all table rows in the Details table
    const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
    const tableData = [];

    console.log(`Capturing ${tableRows.length} rows with all details from table`);

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

    for (let i = 0; i < tableRows.length; i++) {
      const cells = await tableRows[i].locator('[role="gridcell"]').all();

      if (cells.length >= 9) {
        const poNo        = await getCellValue(cells[0]);
        const countryCode = await getCellValue(cells[1]);
        const partNo      = await getCellValue(cells[2]);
        const qty         = await getCellValue(cells[3]);
        const total       = await getCellValue(cells[4]);
        const deliveryNo  = await getCellValue(cells[5]);
        const deliveryDate = await getCellValue(cells[6]);
        const pcdDate     = await getCellValue(cells[7]);
        const fobDate     = await getCellValue(cells[8]);

        if (poNo || partNo) {
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
        }
      }
    }

    console.log('✓ All line item details captured');
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
}
