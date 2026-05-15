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

    // Value help button for Supplier Code field
    this.supplierCodeValueHelpButton = page.locator('[id*="SupplierCode::Field-edit-inner-vhi"][aria-label="Show Value Help"]').first();
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

  async selectFirstSupplierFromValueHelpList() {
    // Wait for the value help dialog to appear
    await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Find and click the first selectable item in the list
    const firstListItem = this.page.locator('[role="dialog"] [role="row"], [role="dialog"] [role="option"]').first();
    await firstListItem.click();

    // Wait for dialog to close
    await this.page.waitForLoadState('networkidle');
  }

  async selectSupplierByCode(supplierCode: string) {
    // Wait for the value help dialog to appear
    await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });

    // Wait for the table to load
    await this.page.waitForSelector('[role="grid"], table', { timeout: 5000 });

    // Find the supplier row in the table that contains the description/code
    const tableRows = await this.page.locator('[role="grid"] [role="row"], table tbody tr').all();
    let found = false;

    for (const row of tableRows) {
      const rowText = await row.textContent();
      if (rowText && (rowText.includes(supplierCode) || rowText.includes('PRIMARK'))) {
        // Click on the Description column cell in this row
        const descriptionCell = row.locator('td').first();
        await descriptionCell.click();
        console.log(`Clicked on supplier row: ${supplierCode}`);
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Supplier with code "${supplierCode}" not found in value help table`);
    }

    // Wait for dialog to close
    await this.page.waitForLoadState('networkidle');
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

    // Wait for calendar to appear
    await this.page.waitForTimeout(500);

    // Click on today's date (marked with sapUiCalItemNow class)
    const todayButton = this.page.locator('[class*="sapUiCalItemNow"]').first();
    await todayButton.click();
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
      const item = lineItems[i];

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
        const deliveryDateInput = cells[6].locator('input').first();
        await deliveryDateInput.fill(item.deliveryDate);
        await deliveryDateInput.press('Tab');
        console.log(`✓ Row ${i}: DeliveryDate = "${item.deliveryDate}"`);
        await this.page.waitForTimeout(300);
      }

      // Column 7: PCD_Date
      if (cells.length > 7) {
        const pcdDateInput = cells[7].locator('input').first();
        await pcdDateInput.fill(item.pcdDate);
        await pcdDateInput.press('Tab');
        console.log(`✓ Row ${i}: PCD_Date = "${item.pcdDate}"`);
        await this.page.waitForTimeout(300);
      }

      // Column 8: FOB_Date
      if (cells.length > 8) {
        const fobDateInput = cells[8].locator('input').first();
        await fobDateInput.fill(item.fobDate);
        await fobDateInput.press('Enter');
        console.log(`✓ Row ${i}: FOB_Date = "${item.fobDate}"`);
        await this.page.waitForTimeout(300);
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

    const getInputValue = async (input: Locator): Promise<string> => {
      try {
        return await input.inputValue();
      } catch {
        return await input.getAttribute('value').then(v => v || '');
      }
    };

    for (let i = 0; i < tableRows.length; i++) {
      const cells = await tableRows[i].locator('[role="gridcell"]').all();

      if (cells.length >= 9) {
        const poNo = await getInputValue(cells[0].locator('input').first());
        const countryCode = await getInputValue(cells[1].locator('input').first());
        const partNo = await getInputValue(cells[2].locator('input').first());
        const qty = await getInputValue(cells[3].locator('input').first());
        const total = await getInputValue(cells[4].locator('input').first());
        const deliveryNo = await getInputValue(cells[5].locator('input').first());
        const deliveryDate = await getInputValue(cells[6].locator('input').first());
        const pcdDate = await getInputValue(cells[7].locator('input').first());
        const fobDate = await getInputValue(cells[8].locator('input').first());

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
        // Extract values from input fields in the cells
        const poNoInput = cells[0].locator('input').first();
        const countryCodeInput = cells[1].locator('input').first();
        const partNoInput = cells[2].locator('input').first();
        const qtyInput = cells[3].locator('input').first();
        const totalInput = cells[4].locator('input').first();

        const getInputValue = async (input: Locator): Promise<string> => {
          try {
            return await input.inputValue();
          } catch {
            return await input.getAttribute('value').then(v => v || '');
          }
        };

        const poNo = await getInputValue(poNoInput);
        const countryCode = await getInputValue(countryCodeInput);
        const partNo = await getInputValue(partNoInput);
        const qty = await getInputValue(qtyInput);
        const total = await getInputValue(totalInput);

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
}
