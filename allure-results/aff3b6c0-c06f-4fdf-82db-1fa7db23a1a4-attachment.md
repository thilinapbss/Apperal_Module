# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 08. TC-BPO-005 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:368:10

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[id*="GeneralInformation"][id*="Details1"][role="grid"] tbody tr[role="row"][data-sap-ui-rowindex]').nth(1).locator('[role="gridcell"]').nth(7).locator('input').first()
    - locator resolved to <input value="" type="text" aria-haspopup="grid" class="sapMInputBaseInner" placeholder="e.g. Dec 31, 2026" aria-roledescription="Date Input" id="__picker1-__clone46-__clone66-inner" aria-labelledby="apperal.buyerpoupload::BuyerPoUploadHeaderObjectPage--fe::table::GeneralInformation::LineItem::Details1::C::PCD_Date-innerColumn"/>
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
    32 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Test source

```ts
  259 |   async enterKimbleNo(kimbleNo: string) {
  260 |     await this.kimbleNoInput.fill(kimbleNo);
  261 |   }
  262 | 
  263 |   async getKimbleNoValue(): Promise<string> {
  264 |     return await this.kimbleNoInput.inputValue();
  265 |   }
  266 | 
  267 |   private async selectTodayInDateCell(cell: Locator) {
  268 |     // Click the input first so SAP UI5 renders the calendar icon in the cell.
  269 |     const input = cell.locator('input').first();
  270 |     await input.click();
  271 | 
  272 |     const calendarIcon = cell.locator('.sapMInputBaseIcon, [aria-label="Open Picker"]').first();
  273 |     await calendarIcon.waitFor({ state: 'visible', timeout: 5000 });
  274 |     await calendarIcon.click();
  275 | 
  276 |     // Multiple sapUiCalItemNow elements may exist in the DOM simultaneously
  277 |     // (e.g. the PODate calendar stays rendered but hidden). .first() would
  278 |     // resolve to the hidden one. Instead, iterate and click the visible one.
  279 |     await this.page.waitForTimeout(300);
  280 |     const allTodayButtons = await this.page.locator('[class*="sapUiCalItemNow"]').all();
  281 |     let clicked = false;
  282 |     for (const btn of allTodayButtons) {
  283 |       if (await btn.isVisible()) {
  284 |         await btn.click();
  285 |         clicked = true;
  286 |         break;
  287 |       }
  288 |     }
  289 |     if (!clicked) {
  290 |       throw new Error('Could not find a visible today button in the date cell calendar');
  291 |     }
  292 | 
  293 |     await this.page.waitForTimeout(300);
  294 |   }
  295 | 
  296 |   private generateUniqueDeliveryNo(rowIndex: number): string {
  297 |     const now = new Date();
  298 |     const month = String(now.getMonth() + 1).padStart(2, '0');
  299 |     const day = String(now.getDate()).padStart(2, '0');
  300 |     const hours = String(now.getHours()).padStart(2, '0');
  301 |     const minutes = String(now.getMinutes()).padStart(2, '0');
  302 |     const sequence = String(rowIndex + 1).padStart(3, '0');
  303 | 
  304 |     // Format: DLV-MMDD-HHMM-XXX (max 18 characters to stay within 20 char limit)
  305 |     return `DLV-${month}${day}-${hours}${minutes}-${sequence}`;
  306 |   }
  307 | 
  308 |   async fillLineItemDetailsInTable(lineItems: Array<{ deliveryDate: string; pcdDate: string; fobDate: string }>): Promise<void> {
  309 |     // Wait for the Details table to be visible
  310 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  311 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  312 | 
  313 |     // Get all table rows
  314 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  315 | 
  316 |     console.log(`\n📋 Filling date details for ${Math.min(lineItems.length, tableRows.length)} line items from test-data.json`);
  317 | 
  318 |     for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
  319 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  320 |       const lineItem = lineItems[i];
  321 | 
  322 |       // Generate unique delivery number with date and time
  323 |       const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);
  324 | 
  325 |       // Column 5: DeliveryNo (auto-generated with date and time)
  326 |       if (cells.length > 5) {
  327 |         const deliveryNoInput = cells[5].locator('input').first();
  328 |         await deliveryNoInput.fill(uniqueDeliveryNo);
  329 |         await deliveryNoInput.press('Tab');
  330 |         console.log(`  ✓ Row ${i + 1}: DeliveryNo = "${uniqueDeliveryNo}"`);
  331 |         await this.page.waitForTimeout(300);
  332 |       }
  333 | 
  334 |       // Column 6: DeliveryDate (from test-data.json)
  335 |       if (cells.length > 6 && lineItem.deliveryDate) {
  336 |         await this.fillDateInputField(cells[6], lineItem.deliveryDate);
  337 |         console.log(`  ✓ Row ${i + 1}: DeliveryDate = "${lineItem.deliveryDate}"`);
  338 |       }
  339 | 
  340 |       // Column 7: PCD_Date (from test-data.json)
  341 |       if (cells.length > 7 && lineItem.pcdDate) {
  342 |         await this.fillDateInputField(cells[7], lineItem.pcdDate);
  343 |         console.log(`  ✓ Row ${i + 1}: PCD_Date = "${lineItem.pcdDate}"`);
  344 |       }
  345 | 
  346 |       // Column 8: FOB_Date (from test-data.json)
  347 |       if (cells.length > 8 && lineItem.fobDate) {
  348 |         await this.fillDateInputField(cells[8], lineItem.fobDate);
  349 |         console.log(`  ✓ Row ${i + 1}: FOB_Date = "${lineItem.fobDate}"`);
  350 |       }
  351 |     }
  352 | 
  353 |     console.log('✓ All line item date details filled in\n');
  354 |   }
  355 | 
  356 |   private async fillDateInputField(cell: Locator, dateString: string): Promise<void> {
  357 |     // Click the input to activate the date field
  358 |     const input = cell.locator('input').first();
> 359 |     await input.click();
      |                 ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  360 |     await this.page.waitForTimeout(300);
  361 | 
  362 |     // Type the date directly into the input field
  363 |     // Format: e.g., "01 Jun 2026" or "2026-06-01"
  364 |     await input.fill(dateString);
  365 |     await input.press('Enter');
  366 |     await this.page.waitForTimeout(300);
  367 |   }
  368 | 
  369 |   async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
  370 |     // Wait for the Details table to be visible
  371 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  372 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  373 | 
  374 |     // Read expected row count from table title span
  375 |     const titleSpan = this.page.locator('[id*="Details1-title-inner"]');
  376 |     const titleText = await titleSpan.textContent();
  377 |     const rowCountMatch = titleText?.match(/\((\d+)\)/);
  378 |     const expectedRowCount = rowCountMatch ? parseInt(rowCountMatch[1]) : 0;
  379 | 
  380 |     // Click clear selection icon (soft click) to clear any current selection
  381 |     const clearIcon = this.page.locator('#__icon5').first();
  382 |     await clearIcon.click({ delay: 100, timeout: 5000, force: false });
  383 |     await this.page.waitForTimeout(500);
  384 | 
  385 |     console.log(`\n📊 ===== LINE ITEMS CAPTURE =====`);
  386 |     console.log(`📌 Table Title: ${titleText}`);
  387 |     console.log(`📌 Expected rows: ${expectedRowCount}`);
  388 |     console.log(`📌 Table selection cleared\n`);
  389 | 
  390 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  391 |     const getCellValue = async (cell: Locator): Promise<string> => {
  392 |       const inputCount = await cell.locator('input').count();
  393 |       if (inputCount > 0) {
  394 |         try {
  395 |           return await cell.locator('input').first().inputValue();
  396 |         } catch {
  397 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  398 |         }
  399 |       }
  400 |       return (await cell.textContent())?.trim() ?? '';
  401 |     };
  402 | 
  403 |     const tableData: Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }> = [];
  404 | 
  405 |     // Capture rows line by line: Press ArrowDown, wait, capture each visible row
  406 |     console.log(`🔄 Capturing rows line by line (ArrowDown → Capture all visible):\n`);
  407 | 
  408 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  409 |       // Press Down arrow key once to move to next row
  410 |       console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Pressing Down arrow key...`);
  411 |       await this.page.keyboard.press('ArrowDown');
  412 |       await this.page.waitForTimeout(500);
  413 | 
  414 |       // Wait 3 seconds for row to render and load
  415 |       console.log(`⏳ Waiting 3 seconds for row to load...`);
  416 |       await this.page.waitForTimeout(3000);
  417 | 
  418 |       // Get ALL visible rows after ArrowDown
  419 |       const allTableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  420 | 
  421 |       console.log(`   Found ${allTableRows.length} visible rows, capturing new ones...\n`);
  422 | 
  423 |       // Capture all visible rows and add only NEW unique ones
  424 |       for (let i = 0; i < allTableRows.length; i++) {
  425 |         const row = allTableRows[i];
  426 |         const cells = await row.locator('[role="gridcell"]').all();
  427 | 
  428 |         if (cells.length > 0) {
  429 |           const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  430 |           const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  431 |           const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  432 |           const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  433 |           const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  434 |           const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  435 |           const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  436 |           const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  437 |           const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  438 | 
  439 |           // Check if this row already exists in tableData
  440 |           const isDuplicate = tableData.some(
  441 |             r => r.poNo === poNo && r.countryCode === countryCode && r.partNo === partNo && r.qty === qty
  442 |           );
  443 | 
  444 |           // Capture row with any data if it's new
  445 |           if ((poNo || partNo || qty || total || countryCode) && !isDuplicate) {
  446 |             tableData.push({
  447 |               poNo: poNo?.trim() || '',
  448 |               countryCode: countryCode?.trim() || '',
  449 |               partNo: partNo?.trim() || '',
  450 |               qty: qty?.trim() || '',
  451 |               total: total?.trim() || '',
  452 |               deliveryNo: deliveryNo?.trim() || '',
  453 |               deliveryDate: deliveryDate?.trim() || '',
  454 |               pcdDate: pcdDate?.trim() || '',
  455 |               fobDate: fobDate?.trim() || ''
  456 |             });
  457 |             console.log(`   ✓ New Row ${tableData.length}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
  458 |           }
  459 |         }
```