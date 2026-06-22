# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:376:10

# Error details

```
Error: locator.evaluate: Error: strict mode violation: locator('[id*="GeneralInformation"][id*="Details1"][role="grid"] tbody') resolved to 2 elements:
    1) <tbody>…</tbody> aka locator('tbody').filter({ hasText: 'PO NoCountry CodePart' })
    2) <tbody>…</tbody> aka locator('[id="apperal.buyerpoupload::BuyerPoUploadHeaderObjectPage--fe::table::GeneralInformation::LineItem::Details1-innerTable-table"] tbody')

Call log:
  - waiting for locator('[id*="GeneralInformation"][id*="Details1"][role="grid"] tbody')

```

# Test source

```ts
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
  316 |     console.log(`Filling details for ${Math.min(lineItems.length, tableRows.length)} line items in table`);
  317 | 
  318 |     for (let i = 0; i < Math.min(lineItems.length, tableRows.length); i++) {
  319 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  320 | 
  321 |       // Generate unique delivery number with date and time
  322 |       const uniqueDeliveryNo = this.generateUniqueDeliveryNo(i);
  323 | 
  324 |       // Column 5: DeliveryNo (auto-generated with date and time)
  325 |       if (cells.length > 5) {
  326 |         const deliveryNoInput = cells[5].locator('input').first();
  327 |         await deliveryNoInput.fill(uniqueDeliveryNo);
  328 |         await deliveryNoInput.press('Tab');
  329 |         console.log(`✓ Row ${i}: DeliveryNo = "${uniqueDeliveryNo}"`);
  330 |         await this.page.waitForTimeout(300);
  331 |       }
  332 | 
  333 |       // Column 6: DeliveryDate
  334 |       if (cells.length > 6) {
  335 |         await this.selectTodayInDateCell(cells[6]);
  336 |         console.log(`✓ Row ${i}: DeliveryDate = today`);
  337 |       }
  338 | 
  339 |       // Column 7: PCD_Date
  340 |       if (cells.length > 7) {
  341 |         await this.selectTodayInDateCell(cells[7]);
  342 |         console.log(`✓ Row ${i}: PCD_Date = today`);
  343 |       }
  344 | 
  345 |       // Column 8: FOB_Date
  346 |       if (cells.length > 8) {
  347 |         await this.selectTodayInDateCell(cells[8]);
  348 |         console.log(`✓ Row ${i}: FOB_Date = today`);
  349 |       }
  350 |     }
  351 | 
  352 |     console.log('✓ All line item details filled in');
  353 |   }
  354 | 
  355 |   async captureLineItemsWithAllDetails(): Promise<Array<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string; deliveryNo: string; deliveryDate: string; pcdDate: string; fobDate: string }>> {
  356 |     // Wait for the Details table to be visible
  357 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  358 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  359 | 
  360 |     // Read expected row count from table title span
  361 |     const titleSpan = this.page.locator('[id*="Details1-title-inner"]');
  362 |     const titleText = await titleSpan.textContent();
  363 |     const rowCountMatch = titleText?.match(/\((\d+)\)/);
  364 |     const expectedRowCount = rowCountMatch ? parseInt(rowCountMatch[1]) : 0;
  365 | 
  366 |     // Click clear selection icon (soft click) to clear any current selection
  367 |     const clearIcon = this.page.locator('#__icon5').first();
  368 |     await clearIcon.click({ delay: 100, timeout: 5000, force: false });
  369 |     await this.page.waitForTimeout(500);
  370 | 
  371 |     console.log(`\n📊 ===== LINE ITEMS CAPTURE =====`);
  372 |     console.log(`📌 Table Title: ${titleText}`);
  373 |     console.log(`📌 Expected rows: ${expectedRowCount}`);
  374 |     console.log(`📌 Table selection cleared\n`);
  375 | 
  376 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  377 |     const getCellValue = async (cell: Locator): Promise<string> => {
  378 |       const inputCount = await cell.locator('input').count();
  379 |       if (inputCount > 0) {
  380 |         try {
  381 |           return await cell.locator('input').first().inputValue();
  382 |         } catch {
  383 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  384 |         }
  385 |       }
  386 |       return (await cell.textContent())?.trim() ?? '';
  387 |     };
  388 | 
  389 |     const tableData = [];
  390 | 
  391 |     // Capture line by line: Scroll table down, wait 3 seconds, capture row
  392 |     console.log(`🔄 Capturing rows one by one (Scroll Down → Wait 3 sec → Capture):\n`);
  393 | 
  394 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  395 |       // Scroll table down by one row (approximately 45px per row in SAP UI5 tables)
  396 |       console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Scrolling table down one row...`);
> 397 |       await this.page.locator(`${tableSelector} tbody`).evaluate((el) => {
      |                                                         ^ Error: locator.evaluate: Error: strict mode violation: locator('[id*="GeneralInformation"][id*="Details1"][role="grid"] tbody') resolved to 2 elements:
  398 |         el.scrollTop += 45; // Scroll by one row height
  399 |       });
  400 |       await this.page.waitForTimeout(500);
  401 | 
  402 |       // Wait 3 seconds for row to render
  403 |       console.log(`⏳ Waiting 3 seconds for row to load...`);
  404 |       await this.page.waitForTimeout(3000);
  405 | 
  406 |       // Get first visible row in table
  407 |       const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  408 | 
  409 |       if (tableRows.length > 0) {
  410 |         const firstRow = tableRows[0];
  411 |         const cells = await firstRow.locator('[role="gridcell"]').all();
  412 | 
  413 |         if (cells.length > 0) {
  414 |           const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  415 |           const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  416 |           const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  417 |           const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  418 |           const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  419 |           const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  420 |           const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  421 |           const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  422 |           const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  423 | 
  424 |           // Capture row with any data
  425 |           if (poNo || partNo || qty || total || countryCode) {
  426 |             tableData.push({
  427 |               poNo: poNo?.trim() || '',
  428 |               countryCode: countryCode?.trim() || '',
  429 |               partNo: partNo?.trim() || '',
  430 |               qty: qty?.trim() || '',
  431 |               total: total?.trim() || '',
  432 |               deliveryNo: deliveryNo?.trim() || '',
  433 |               deliveryDate: deliveryDate?.trim() || '',
  434 |               pcdDate: pcdDate?.trim() || '',
  435 |               fobDate: fobDate?.trim() || ''
  436 |             });
  437 |             console.log(`✓ Captured Row ${rowIndex + 1}: ${poNo} | ${countryCode} | ${partNo} | ${qty}\n`);
  438 |           }
  439 |         }
  440 |       }
  441 |     }
  442 | 
  443 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  444 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  445 | 
  446 |     if (tableData.length === expectedRowCount) {
  447 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  448 |     } else if (tableData.length > 0) {
  449 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  450 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  451 |     } else {
  452 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  453 |     }
  454 | 
  455 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  456 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  457 |     console.log(`------|-------|---------|---------|-----|-------`);
  458 |     tableData.forEach((row, index) => {
  459 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  460 |     });
  461 |     console.log(`=============================\n`);
  462 | 
  463 |     // Throw error if we didn't get all expected rows
  464 |     if (tableData.length !== expectedRowCount) {
  465 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
  466 |     }
  467 | 
  468 |     return tableData;
  469 |   }
  470 | 
  471 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  472 |     // Wait for the Details table to be visible
  473 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  474 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  475 | 
  476 |     // Get all table rows in the Details table
  477 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  478 |     const tableData = [];
  479 | 
  480 |     console.log(`Found ${tableRows.length} rows in Details table`);
  481 | 
  482 |     for (let i = 0; i < tableRows.length; i++) {
  483 |       // Get cells in the current row
  484 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  485 | 
  486 |       if (cells.length >= 5) {
  487 |         const getCellValue = async (cell: Locator): Promise<string> => {
  488 |           const inputCount = await cell.locator('input').count();
  489 |           if (inputCount > 0) {
  490 |             try {
  491 |               return await cell.locator('input').first().inputValue();
  492 |             } catch {
  493 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  494 |             }
  495 |           }
  496 |           return (await cell.textContent())?.trim() ?? '';
  497 |         };
```