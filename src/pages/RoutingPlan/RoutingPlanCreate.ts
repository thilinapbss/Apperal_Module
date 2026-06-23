import { Page, Locator } from '@playwright/test';

export class RoutingPlanCreate {
  readonly page: Page;
  readonly createDetailButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
    this.saveButton = page.locator('button[id*="FooterBar::StandardAction::Save"]');
  }

  async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string; SemifinishedGood: string; FinishedGood: string }[]) {
    console.log('\n📝 STEP 1: Creating rows and filling data...\n');

    for (let i = 0; i < details.length; i++) {
      console.log(`[Row ${i + 1}/${details.length}] Click Create button...`);
      await this.createDetailButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2500);

      const tbody = this.page.locator('tbody[id*="RotingPlanDetails-innerTable-tblBody"]');
      const newRow = tbody.locator('tr[id*="innerTableRow"]').first();

      console.log(`[Row ${i + 1}] Fill Route Code: ${details[i].routeCode}`);
      const codeCell = newRow.locator('td[data-sap-ui-column*="DepartmentCode-innerColumn"]');
      const codeInput = codeCell.locator('input[type="text"]');
      await codeInput.fill(details[i].routeCode);
      await this.page.waitForTimeout(300);

      console.log(`[Row ${i + 1}] Fill Route Name: ${details[i].routeName}`);
      const nameCell = newRow.locator('td[data-sap-ui-column*="DepartmentName-innerColumn"]');
      const nameInput = nameCell.locator('input[type="text"]');
      await nameInput.fill(details[i].routeName);
      await this.page.waitForTimeout(300);

      console.log(`[Row ${i + 1}] Fill Warehouse: ${details[i].warehouse}`);
      const warehouseCell = newRow.locator('td[data-sap-ui-column*="warehouse-innerColumn"]');
      const warehouseInput = warehouseCell.locator('input[role="combobox"]');
      await warehouseInput.fill(details[i].warehouse);
      await this.page.waitForTimeout(300);

      // Wait for dropdown to appear
      await this.page.waitForTimeout(500);

      // Look for and click the exact matching warehouse option in the dropdown
      const warehouseOption = this.page.locator(`div[role="option"]:has-text("${details[i].warehouse}")`).first();
      try {
        await warehouseOption.click({ timeout: 3000 });
        console.log(`[Row ${i + 1}] Warehouse option selected: ${details[i].warehouse}`);
      } catch {
        // If exact match not found, use arrow down and Enter to select
        console.log(`[Row ${i + 1}] Exact warehouse option not found, using keyboard selection...`);
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter');
      }
      await this.page.waitForTimeout(800);

      // Fill Semifinished Good field
      console.log(`[Row ${i + 1}] Fill Semifinished Good: ${details[i].SemifinishedGood}`);
      const semifinishedCell = newRow.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
      const semifinishedInput = semifinishedCell.locator('input[role="combobox"]');
      await semifinishedInput.fill(details[i].SemifinishedGood);
      await this.page.waitForTimeout(500);

      // Fill Finished Good field using XPath
      console.log(`[Row ${i + 1}] Fill Finished Good: ${details[i].FinishedGood}`);
      const finishedGoodInput = this.page.locator("(//td[@role='gridcell' and @aria-colindex='6' and contains(@data-sap-ui-column,'finishedGoods-innerColumn')])[1]//input[@role='combobox']");
      await finishedGoodInput.fill(details[i].FinishedGood);
      await this.page.waitForTimeout(500);

      console.log(`✓ Row ${i + 1} completed\n`);
    }

    console.log(`✓ All ${details.length} rows filled\n`);
  }

  async clickSaveButton() {
    console.log('📝 STEP 2: Clicking Save button...\n');
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    console.log('✓ Routing Plan saved successfully\n');
  }

  async verifyAndCloseSuccessDialog() {
    console.log('📝 STEP 3: Checking for dialogs...\n');

    // Wait a bit for any dialog to appear
    await this.page.waitForTimeout(500);

    // Check for any alert dialog (error or success)
    const anyDialog = this.page.locator('[role="alertdialog"]');
    const dialogExists = await anyDialog.isVisible({ timeout: 2000 }).catch(() => false);

    if (dialogExists) {
      // Get the dialog message
      const dialogMessage = this.page.locator('span[class*="sapMMsgBoxText"]');
      const messageText = await dialogMessage.textContent().catch(() => '');

      // Check if it's an error dialog
      const isError = await anyDialog.evaluate(el => el.className.includes('Error')).catch(() => false);

      if (isError) {
        console.log('\n❌ ================================');
        console.log('ERROR DIALOG DETECTED');
        console.log('================================');
        console.log(`Error Message: ${messageText}`);
        console.log('================================\n');
      } else {
        console.log(`✓ Success message: ${messageText}`);
      }

      // Wait and click OK button to close
      await this.page.waitForTimeout(1000);
      const okButton = this.page.locator('button[id*="mbox-btn-0"]');
      const okButtonExists = await okButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (okButtonExists) {
        await okButton.click();
        await this.page.waitForTimeout(1500);
        console.log('✓ Dialog closed - continuing test flow\n');
      } else {
        console.log('ℹ OK button not found\n');
      }
    } else {
      console.log('ℹ No dialog displayed - continuing with flow\n');
    }
  }

  async captureAndSaveFormData(filePath: string) {
    const fs = require('fs');
    const path = require('path');

    // Capture routing plan header data
    const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
    const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
    const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');

    const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
    const status = await statusInput.inputValue().catch(() => '');
    const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');

    // Capture detail rows from the table
    const detailRows = [];
    const tableRows = this.page.locator('tr[id*="innerTableRow"]');
    const rowCount = await tableRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = tableRows.nth(i);

      // Get text inputs for route code and name
      const inputs = row.locator('input[type="text"]');
      const inputCount = await inputs.count();

      if (inputCount >= 2) {
        const routeCode = await inputs.nth(0).inputValue().catch(() => '');
        const routeName = await inputs.nth(1).inputValue().catch(() => '');

        // Get all combobox inputs (warehouse, semifinished goods, finished goods)
        const comboboxes = row.locator('input[role="combobox"]');
        const comboboxCount = await comboboxes.count();

        let warehouse = '';
        let semifinishedGood = '';
        let finishedGood = '';

        if (comboboxCount >= 1) {
          warehouse = await comboboxes.nth(0).inputValue().catch(() => '');
        }
        if (comboboxCount >= 2) {
          semifinishedGood = await comboboxes.nth(1).inputValue().catch(() => '');
        }
        if (comboboxCount >= 3) {
          finishedGood = await comboboxes.nth(2).inputValue().catch(() => '');
        }

        if (routeCode) {
          detailRows.push({
            routeCode: routeCode,
            routeName: routeName,
            warehouse: warehouse,
            SemifinishedGood: semifinishedGood,
            FinishedGood: finishedGood
          });
        }
      }
    }

    // Create the data structure
    const formData = {
      routingPlanName: routingPlanName.trim(),
      routingPlanCode: routingPlanCode?.trim() || '',
      status: status,
      details: detailRows
    };

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
    console.log(`Routing plan data captured and saved to ${filePath}`);
  }
}
