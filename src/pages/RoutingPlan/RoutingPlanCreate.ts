import { Page, Locator } from '@playwright/test';

export class RoutingPlanCreate {
  readonly page: Page;
  readonly createDetailButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  }

  async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string }[]) {
    for (let i = 0; i < details.length; i++) {
      await this.createDetailButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      // Get the most recently created row inputs
      const codeInput = this.page.locator("td[data-sap-ui-column*='DepartmentCode-innerColumn'] input").first();
      const nameInput = this.page.locator("td[data-sap-ui-column*='DepartmentName-innerColumn'] input").first();
      const warehouseInput = this.page.locator("td[data-sap-ui-column*='warehouse-innerColumn'] input").first();

      await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
      await this.page.keyboard.press('Tab');

      await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
      await this.page.keyboard.press('Tab');

      // Type warehouse code and open dropdown
      await warehouseInput.fill(details[i].warehouse);
      await this.page.waitForTimeout(300);

      // Click value help button to open dropdown
      const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
      await valueHelpButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(800);

      // Wait for the dropdown table to be attached to DOM (may be hidden)
      const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
      await tableBody.waitFor({ state: 'attached', timeout: 10000 });
      await this.page.waitForTimeout(500);

      // Find and click the warehouse option in the table by finding the span with warehouse code
      const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
      await warehouseOptionRow.first().click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);

      console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
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

        // Get warehouse code from combobox
        const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');

        if (routeCode) {
          detailRows.push({
            routeCode: routeCode,
            routeName: routeName,
            warehouse: warehouseCode
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
