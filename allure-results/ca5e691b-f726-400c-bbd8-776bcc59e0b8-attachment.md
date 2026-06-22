# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:376:10

# Error details

```
Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
```

# Test source

```ts
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
  391 |     // Capture line by line: wait 3 seconds, capture row, press Page Down
  392 |     console.log(`🔄 Capturing rows line by line (3 second wait between each):\n`);
  393 | 
  394 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  395 |       // Wait 3 seconds before capturing
  396 |       console.log(`⏳ Row ${rowIndex + 1}/${expectedRowCount} - Waiting 3 seconds...`);
  397 |       await this.page.waitForTimeout(3000);
  398 | 
  399 |       // Get first visible row in table
  400 |       const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  401 | 
  402 |       if (tableRows.length > 0) {
  403 |         const firstRow = tableRows[0];
  404 |         const cells = await firstRow.locator('[role="gridcell"]').all();
  405 | 
  406 |         if (cells.length > 0) {
  407 |           const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  408 |           const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  409 |           const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  410 |           const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  411 |           const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  412 |           const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  413 |           const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  414 |           const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  415 |           const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  416 | 
  417 |           // Capture row with any data
  418 |           if (poNo || partNo || qty || total || countryCode) {
  419 |             tableData.push({
  420 |               poNo: poNo?.trim() || '',
  421 |               countryCode: countryCode?.trim() || '',
  422 |               partNo: partNo?.trim() || '',
  423 |               qty: qty?.trim() || '',
  424 |               total: total?.trim() || '',
  425 |               deliveryNo: deliveryNo?.trim() || '',
  426 |               deliveryDate: deliveryDate?.trim() || '',
  427 |               pcdDate: pcdDate?.trim() || '',
  428 |               fobDate: fobDate?.trim() || ''
  429 |             });
  430 |             console.log(`✓ Captured Row ${rowIndex + 1}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
  431 |           }
  432 |         }
  433 | 
  434 |         // Press Page Down to load next row (unless it's the last row)
  435 |         if (rowIndex < expectedRowCount - 1) {
  436 |           console.log(`⬇️  Pressing Page Down to load next row...\n`);
  437 |           await this.page.keyboard.press('PageDown');
  438 |           await this.page.waitForTimeout(500);
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
> 458 |     tableData.forEach((row, index) => {
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
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
  498 | 
  499 |         const poNo        = await getCellValue(cells[0]);
  500 |         const countryCode = await getCellValue(cells[1]);
  501 |         const partNo      = await getCellValue(cells[2]);
  502 |         const qty         = await getCellValue(cells[3]);
  503 |         const total       = await getCellValue(cells[4]);
  504 | 
  505 |         tableData.push({
  506 |           poNo: poNo?.trim() || '',
  507 |           countryCode: countryCode?.trim() || '',
  508 |           partNo: partNo?.trim() || '',
  509 |           qty: qty?.trim() || '',
  510 |           total: total?.trim() || ''
  511 |         });
  512 | 
  513 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  514 |       }
  515 |     }
  516 | 
  517 |     return tableData;
  518 |   }
  519 | 
  520 |   async waitForSuccessMessage() {
  521 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  522 |   }
  523 | 
  524 |   async isSuccessMessageVisible(): Promise<boolean> {
  525 |     return await this.successMessage.isVisible();
  526 |   }
  527 | 
  528 |   async getSuccessMessage(): Promise<string> {
  529 |     return await this.successMessage.textContent() || '';
  530 |   }
  531 | 
  532 |   // Helper method to safely get field value with fallbacks
  533 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  534 |     try {
  535 |       const count = await locator.count();
  536 |       if (count === 0) {
  537 |         console.log(`Field "${fieldName}" not found with selector`);
  538 |         return '';
  539 |       }
  540 | 
  541 |       // Try inputValue() first (works for input elements)
  542 |       try {
  543 |         const value = await locator.inputValue();
  544 |         if (value) {
  545 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  546 |           return value;
  547 |         }
  548 |       } catch (e) {
  549 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  550 |       }
  551 | 
  552 |       // Fallback to getAttribute('value')
  553 |       const attrValue = await locator.getAttribute('value');
  554 |       if (attrValue) {
  555 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  556 |         return attrValue;
  557 |       }
  558 | 
```