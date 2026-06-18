# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 22. Fill in all line item details (Delivery No, Dates)
- Location: e2e\apparel_regression_testing.spec.ts:409:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[id*="GeneralInformation"][id*="Details1"][role="grid"] tbody tr[role="row"][data-sap-ui-rowindex]').first().locator('[role="gridcell"]').nth(8).locator('input').first()
    - locator resolved to <input value="" type="text" aria-haspopup="grid" class="sapMInputBaseInner" placeholder="e.g. Dec 31, 2026" aria-roledescription="Date Input" id="__picker2-__clone47-__clone56-inner" aria-labelledby="apperal.buyerpoupload::BuyerPoUploadHeaderObjectPage--fe::table::GeneralInformation::LineItem::Details1::C::FOB_Date-innerColumn"/>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    11 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  154 |     // Wait for the first data row to be rendered and not in a loading/overlay state.
  155 |     const firstCell = this.page.locator(
  156 |       '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex="0"] td'
  157 |     ).first();
  158 |     await firstCell.waitFor({ state: 'visible', timeout: 10000 });
  159 |     await firstCell.click();
  160 | 
  161 |     // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
  162 |     const dialog = this.page.locator('[role="dialog"]').first();
  163 |     if (await dialog.isVisible()) {
  164 |       const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
  165 |       if (await okButton.isVisible()) {
  166 |         await okButton.click();
  167 |       }
  168 |     }
  169 | 
  170 |     await this.waitForSupplierDialogToClose();
  171 |   }
  172 | 
  173 |   async selectSupplierByCode(supplierCode: string) {
  174 |     await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  175 | 
  176 |     // Wait for table rows to be rendered.
  177 |     await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]', {
  178 |       timeout: 10000,
  179 |     });
  180 | 
  181 |     const tableRows = await this.page.locator(
  182 |       '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]'
  183 |     ).all();
  184 |     let found = false;
  185 | 
  186 |     for (const row of tableRows) {
  187 |       const rowText = await row.textContent();
  188 |       if (rowText && rowText.includes(supplierCode)) {
  189 |         await row.locator('td').first().click();
  190 |         console.log(`Clicked on supplier row: ${supplierCode}`);
  191 |         found = true;
  192 |         break;
  193 |       }
  194 |     }
  195 | 
  196 |     if (!found) {
  197 |       throw new Error(`Supplier with code "${supplierCode}" not found in value help table`);
  198 |     }
  199 | 
  200 |     // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
  201 |     const dialog = this.page.locator('[role="dialog"]').first();
  202 |     if (await dialog.isVisible()) {
  203 |       const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
  204 |       if (await okButton.isVisible()) {
  205 |         await okButton.click();
  206 |       }
  207 |     }
  208 | 
  209 |     await this.waitForSupplierDialogToClose();
  210 |   }
  211 | 
  212 |   async enterPODate(date: string) {
  213 |     // Clear any existing value and enter new date
  214 |     await this.poDateInput.fill('');
  215 |     await this.poDateInput.fill(date);
  216 |     await this.poDateInput.press('Enter');
  217 |   }
  218 | 
  219 |   async selectTodayFromCalendar() {
  220 |     // Click on the calendar/picker icon to open the date picker
  221 |     const calendarIcon = this.page.locator('[id*="PODate::Field-edit-icon"]').first();
  222 |     await calendarIcon.click();
  223 |     console.log('✓ Opened calendar picker');
  224 | 
  225 |     await this.page.waitForTimeout(500);
  226 | 
  227 |     const allTodayButtons = await this.page.locator('[class*="sapUiCalItemNow"]').all();
  228 |     for (const btn of allTodayButtons) {
  229 |       if (await btn.isVisible()) {
  230 |         await btn.click();
  231 |         break;
  232 |       }
  233 |     }
  234 |     console.log('✓ Selected today from calendar');
  235 | 
  236 |     await this.page.waitForTimeout(500);
  237 |   }
  238 | 
  239 |   async getPODateValue(): Promise<string> {
  240 |     return await this.poDateInput.inputValue();
  241 |   }
  242 | 
  243 |   async enterKimbleNo(kimbleNo: string) {
  244 |     await this.kimbleNoInput.fill(kimbleNo);
  245 |   }
  246 | 
  247 |   async getKimbleNoValue(): Promise<string> {
  248 |     return await this.kimbleNoInput.inputValue();
  249 |   }
  250 | 
  251 |   private async selectTodayInDateCell(cell: Locator) {
  252 |     // Click the input first so SAP UI5 renders the calendar icon in the cell.
  253 |     const input = cell.locator('input').first();
> 254 |     await input.click();
      |                 ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  255 | 
  256 |     const calendarIcon = cell.locator('.sapMInputBaseIcon, [aria-label="Open Picker"]').first();
  257 |     await calendarIcon.waitFor({ state: 'visible', timeout: 5000 });
  258 |     await calendarIcon.click();
  259 | 
  260 |     // Multiple sapUiCalItemNow elements may exist in the DOM simultaneously
  261 |     // (e.g. the PODate calendar stays rendered but hidden). .first() would
  262 |     // resolve to the hidden one. Instead, iterate and click the visible one.
  263 |     await this.page.waitForTimeout(300);
  264 |     const allTodayButtons = await this.page.locator('[class*="sapUiCalItemNow"]').all();
  265 |     let clicked = false;
  266 |     for (const btn of allTodayButtons) {
  267 |       if (await btn.isVisible()) {
  268 |         await btn.click();
  269 |         clicked = true;
  270 |         break;
  271 |       }
  272 |     }
  273 |     if (!clicked) {
  274 |       throw new Error('Could not find a visible today button in the date cell calendar');
  275 |     }
  276 | 
  277 |     await this.page.waitForTimeout(300);
  278 |   }
  279 | 
  280 |   private generateUniqueDeliveryNo(rowIndex: number): string {
  281 |     const now = new Date();
  282 |     const month = String(now.getMonth() + 1).padStart(2, '0');
  283 |     const day = String(now.getDate()).padStart(2, '0');
  284 |     const hours = String(now.getHours()).padStart(2, '0');
  285 |     const minutes = String(now.getMinutes()).padStart(2, '0');
  286 |     const sequence = String(rowIndex + 1).padStart(3, '0');
  287 | 
  288 |     // Format: DLV-MMDD-HHMM-XXX (max 18 characters to stay within 20 char limit)
  289 |     return `DLV-${month}${day}-${hours}${minutes}-${sequence}`;
  290 |   }
  291 | 
  292 |   async fillLineItemDetailsInTable(lineItems: Array<{ deliveryDate: string; pcdDate: string; fobDate: string }>): Promise<void> {
  293 |     // Wait for the Details table to be visible
  294 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  295 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  296 | 
  297 |     // Get all table rows
  298 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  299 | 
  300 |     console.log(`Filling details for ${Math.min(lineItems.length, tableRows.length)} line items in table`);
  301 | 
  302 |     for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
  303 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  304 | 
  305 |       // Generate unique delivery number with date and time
  306 |       const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);
  307 | 
  308 |       // Column 5: DeliveryNo (auto-generated with date and time)
  309 |       if (cells.length > 5) {
  310 |         const deliveryNoInput = cells[5].locator('input').first();
  311 |         await deliveryNoInput.fill(uniqueDeliveryNo);
  312 |         await deliveryNoInput.press('Tab');
  313 |         console.log(`✓ Row ${i}: DeliveryNo = "${uniqueDeliveryNo}"`);
  314 |         await this.page.waitForTimeout(300);
  315 |       }
  316 | 
  317 |       // Column 6: DeliveryDate
  318 |       if (cells.length > 6) {
  319 |         await this.selectTodayInDateCell(cells[6]);
  320 |         console.log(`✓ Row ${i}: DeliveryDate = today`);
  321 |       }
  322 | 
  323 |       // Column 7: PCD_Date
  324 |       if (cells.length > 7) {
  325 |         await this.selectTodayInDateCell(cells[7]);
  326 |         console.log(`✓ Row ${i}: PCD_Date = today`);
  327 |       }
  328 | 
  329 |       // Column 8: FOB_Date
  330 |       if (cells.length > 8) {
  331 |         await this.selectTodayInDateCell(cells[8]);
  332 |         console.log(`✓ Row ${i}: FOB_Date = today`);
  333 |       }
  334 |     }
  335 | 
  336 |     console.log('✓ All line item details filled in');
  337 |   }
  338 | 
  339 |   async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
  340 |     // Wait for the Details table to be visible
  341 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  342 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  343 | 
  344 |     // Get all table rows in the Details table
  345 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  346 |     const tableData = [];
  347 | 
  348 |     console.log(`Capturing ${tableRows.length} rows with all details from table`);
  349 | 
  350 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  351 |     const getCellValue = async (cell: Locator): Promise<string> => {
  352 |       const inputCount = await cell.locator('input').count();
  353 |       if (inputCount > 0) {
  354 |         try {
```