# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 08. TC-BPO-005 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:368:10

# Error details

```
TimeoutError: locator.click: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#__icon5').first()
    - locator resolved to <span id="__icon5" aria-hidden="true" role="presentation" data-sap-ui="__icon5" data-sap-ui-render="" data-sap-ui-icon-content="" class="sapUiIcon sapUiTableSelectClear"></span>
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
    5 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms

```

# Test source

```ts
  286 |     for (const btn of allTodayButtons) {
  287 |       if (await btn.isVisible()) {
  288 |         await btn.click();
  289 |         clicked = true;
  290 |         break;
  291 |       }
  292 |     }
  293 |     if (!clicked) {
  294 |       throw new Error('Could not find a visible today button in the date cell calendar');
  295 |     }
  296 | 
  297 |     await this.page.waitForTimeout(300);
  298 |   }
  299 | 
  300 |   private generateUniqueDeliveryNo(rowIndex: number): string {
  301 |     const now = new Date();
  302 |     const month = String(now.getMonth() + 1).padStart(2, '0');
  303 |     const day = String(now.getDate()).padStart(2, '0');
  304 |     const hours = String(now.getHours()).padStart(2, '0');
  305 |     const minutes = String(now.getMinutes()).padStart(2, '0');
  306 |     const sequence = String(rowIndex + 1).padStart(3, '0');
  307 | 
  308 |     // Format: DLV-MMDD-HHMM-XXX (max 18 characters to stay within 20 char limit)
  309 |     return `DLV-${month}${day}-${hours}${minutes}-${sequence}`;
  310 |   }
  311 | 
  312 |   async fillLineItemDetailsInTable(lineItems: Array<{ deliveryDate: string; pcdDate: string; fobDate: string }>): Promise<void> {
  313 |     // Wait for the Details table to be visible
  314 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  315 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  316 | 
  317 |     // Get all table rows
  318 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  319 | 
  320 |     console.log(`\n📋 Filling date details for ${Math.min(lineItems.length, tableRows.length)} line items from test-data.json`);
  321 | 
  322 |     for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
  323 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  324 |       const lineItem = lineItems[i];
  325 | 
  326 |       // Generate unique delivery number with date and time
  327 |       const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);
  328 | 
  329 |       // Column 5: DeliveryNo (auto-generated with date and time)
  330 |       if (cells.length > 5) {
  331 |         const deliveryNoInput = cells[5].locator('input').first();
  332 |         await deliveryNoInput.fill(uniqueDeliveryNo);
  333 |         await deliveryNoInput.press('Tab');
  334 |         console.log(`  ✓ Row ${i + 1}: DeliveryNo = "${uniqueDeliveryNo}"`);
  335 |         await this.page.waitForTimeout(300);
  336 |       }
  337 | 
  338 |       // Column 6: DeliveryDate (from test-data.json)
  339 |       if (cells.length > 6 && lineItem.deliveryDate) {
  340 |         await this.fillDateInputField(cells[6], lineItem.deliveryDate);
  341 |         console.log(`  ✓ Row ${i + 1}: DeliveryDate = "${lineItem.deliveryDate}"`);
  342 |       }
  343 | 
  344 |       // Column 7: PCD_Date (from test-data.json)
  345 |       if (cells.length > 7 && lineItem.pcdDate) {
  346 |         await this.fillDateInputField(cells[7], lineItem.pcdDate);
  347 |         console.log(`  ✓ Row ${i + 1}: PCD_Date = "${lineItem.pcdDate}"`);
  348 |       }
  349 | 
  350 |       // Column 8: FOB_Date (from test-data.json)
  351 |       if (cells.length > 8 && lineItem.fobDate) {
  352 |         await this.fillDateInputField(cells[8], lineItem.fobDate);
  353 |         console.log(`  ✓ Row ${i + 1}: FOB_Date = "${lineItem.fobDate}"`);
  354 |       }
  355 |     }
  356 | 
  357 |     console.log('✓ All line item date details filled in\n');
  358 |   }
  359 | 
  360 |   private async fillDateInputField(cell: Locator, dateString: string): Promise<void> {
  361 |     // Click the input to activate the date field
  362 |     const input = cell.locator('input').first();
  363 |     await input.click();
  364 |     await this.page.waitForTimeout(300);
  365 | 
  366 |     // Type the date directly into the input field
  367 |     // Format: e.g., "01 Jun 2026" or "2026-06-01"
  368 |     await input.fill(dateString);
  369 |     await input.press('Enter');
  370 |     await this.page.waitForTimeout(300);
  371 |   }
  372 | 
  373 |   async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
  374 |     // Wait for the Details table to be visible
  375 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  376 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  377 | 
  378 |     // Read expected row count from table title span
  379 |     const titleSpan = this.page.locator('[id*="Details1-title-inner"]');
  380 |     const titleText = await titleSpan.textContent();
  381 |     const rowCountMatch = titleText?.match(/\((\d+)\)/);
  382 |     const expectedRowCount = rowCountMatch ? parseInt(rowCountMatch[1]) : 0;
  383 | 
  384 |     // Click clear selection icon (soft click) to clear any current selection
  385 |     const clearIcon = this.page.locator('#__icon5').first();
> 386 |     await clearIcon.click({ delay: 100, timeout: 5000, force: false });
      |                     ^ TimeoutError: locator.click: Timeout 5000ms exceeded.
  387 |     await this.page.waitForTimeout(500);
  388 | 
  389 |     console.log(`\n📊 ===== LINE ITEMS CAPTURE =====`);
  390 |     console.log(`📌 Table Title: ${titleText}`);
  391 |     console.log(`📌 Expected rows: ${expectedRowCount}`);
  392 |     console.log(`📌 Table selection cleared\n`);
  393 | 
  394 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  395 |     const getCellValue = async (cell: Locator): Promise<string> => {
  396 |       const inputCount = await cell.locator('input').count();
  397 |       if (inputCount > 0) {
  398 |         try {
  399 |           return await cell.locator('input').first().inputValue();
  400 |         } catch {
  401 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  402 |         }
  403 |       }
  404 |       return (await cell.textContent())?.trim() ?? '';
  405 |     };
  406 | 
  407 |     const tableData: Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }> = [];
  408 | 
  409 |     // Capture rows line by line: Press ArrowDown, wait, capture each visible row
  410 |     console.log(`🔄 Capturing rows line by line (ArrowDown → Capture all visible):\n`);
  411 | 
  412 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  413 |       // Press Down arrow key once to move to next row
  414 |       console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Pressing Down arrow key...`);
  415 |       await this.page.keyboard.press('ArrowDown');
  416 |       await this.page.waitForTimeout(500);
  417 | 
  418 |       // Wait 3 seconds for row to render and load
  419 |       console.log(`⏳ Waiting 3 seconds for row to load...`);
  420 |       await this.page.waitForTimeout(3000);
  421 | 
  422 |       // Get ALL visible rows after ArrowDown
  423 |       const allTableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  424 | 
  425 |       console.log(`   Found ${allTableRows.length} visible rows, capturing new ones...\n`);
  426 | 
  427 |       // Capture all visible rows and add only NEW unique ones
  428 |       for (let i = 0; i < allTableRows.length; i++) {
  429 |         const row = allTableRows[i];
  430 |         const cells = await row.locator('[role="gridcell"]').all();
  431 | 
  432 |         if (cells.length > 0) {
  433 |           const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  434 |           const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  435 |           const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  436 |           const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  437 |           const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  438 |           const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  439 |           const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  440 |           const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  441 |           const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  442 | 
  443 |           // Check if this row already exists in tableData
  444 |           const isDuplicate = tableData.some(
  445 |             r => r.poNo === poNo && r.countryCode === countryCode && r.partNo === partNo && r.qty === qty
  446 |           );
  447 | 
  448 |           // Capture row with any data if it's new
  449 |           if ((poNo || partNo || qty || total || countryCode) && !isDuplicate) {
  450 |             tableData.push({
  451 |               poNo: poNo?.trim() || '',
  452 |               countryCode: countryCode?.trim() || '',
  453 |               partNo: partNo?.trim() || '',
  454 |               qty: qty?.trim() || '',
  455 |               total: total?.trim() || '',
  456 |               deliveryNo: deliveryNo?.trim() || '',
  457 |               deliveryDate: deliveryDate?.trim() || '',
  458 |               pcdDate: pcdDate?.trim() || '',
  459 |               fobDate: fobDate?.trim() || ''
  460 |             });
  461 |             console.log(`   ✓ New Row ${tableData.length}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
  462 |           }
  463 |         }
  464 |       }
  465 |     }
  466 | 
  467 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  468 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  469 | 
  470 |     if (tableData.length === expectedRowCount) {
  471 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  472 |     } else if (tableData.length > 0) {
  473 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  474 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  475 |     } else {
  476 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  477 |     }
  478 | 
  479 |     console.log(`\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
  480 |     console.log(`📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  481 |     console.log(`════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
  482 | 
  483 |     console.log(`\nRow # | PO No        | Country | Part No    | Qty        | Total      | Delivery No     | Delivery Date   | PCD Date        | FOB Date`);
  484 |     console.log(`──────┼──────────────┼─────────┼────────────┼────────────┼────────────┼─────────────────┼─────────────────┼─────────────────┼──────────────`);
  485 | 
  486 |     tableData.forEach((row, index) => {
```