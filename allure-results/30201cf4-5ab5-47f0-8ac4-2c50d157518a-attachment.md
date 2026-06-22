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
  391 |     // Load all rows: Press Down arrow key for each expected row
  392 |     console.log(`🔄 Loading all rows (Down Arrow navigation):\n`);
  393 | 
  394 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  395 |       // Press Down arrow key once to move to next row
  396 |       console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Pressing Down arrow key...`);
  397 |       await this.page.keyboard.press('ArrowDown');
  398 |       await this.page.waitForTimeout(500);
  399 | 
  400 |       // Wait 3 seconds for row to render and load
  401 |       console.log(`⏳ Waiting 3 seconds for row to load...`);
  402 |       await this.page.waitForTimeout(3000);
  403 |     }
  404 | 
  405 |     console.log(`\n✓ All rows loaded via ArrowDown navigation\n`);
  406 | 
  407 |     // Now capture all rows from the fully loaded table
  408 |     console.log(`📋 Capturing all ${expectedRowCount} rows from table:\n`);
  409 | 
  410 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  411 | 
  412 |     for (let rowIndex = 0; rowIndex < tableRows.length && rowIndex < expectedRowCount; rowIndex++) {
  413 |       const row = tableRows[rowIndex];
  414 |       const cells = await row.locator('[role="gridcell"]').all();
  415 | 
  416 |       if (cells.length > 0) {
  417 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  418 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  419 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  420 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  421 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  422 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  423 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  424 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  425 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  426 | 
  427 |         // Capture row with any data
  428 |         if (poNo || partNo || qty || total || countryCode) {
  429 |           tableData.push({
  430 |             poNo: poNo?.trim() || '',
  431 |             countryCode: countryCode?.trim() || '',
  432 |             partNo: partNo?.trim() || '',
  433 |             qty: qty?.trim() || '',
  434 |             total: total?.trim() || '',
  435 |             deliveryNo: deliveryNo?.trim() || '',
  436 |             deliveryDate: deliveryDate?.trim() || '',
  437 |             pcdDate: pcdDate?.trim() || '',
  438 |             fobDate: fobDate?.trim() || ''
  439 |           });
  440 |           console.log(`✓ Row ${rowIndex + 1}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
  441 |         }
  442 |       }
  443 |     }
  444 | 
  445 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  446 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  447 | 
  448 |     if (tableData.length === expectedRowCount) {
  449 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  450 |     } else if (tableData.length > 0) {
  451 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  452 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  453 |     } else {
  454 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  455 |     }
  456 | 
  457 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  458 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  459 |     console.log(`------|-------|---------|---------|-----|-------`);
  460 |     tableData.forEach((row, index) => {
  461 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  462 |     });
  463 |     console.log(`=============================\n`);
  464 | 
  465 |     // Throw error if we didn't get all expected rows
  466 |     if (tableData.length !== expectedRowCount) {
> 467 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  468 |     }
  469 | 
  470 |     return tableData;
  471 |   }
  472 | 
  473 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  474 |     // Wait for the Details table to be visible
  475 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  476 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  477 | 
  478 |     // Get all table rows in the Details table
  479 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  480 |     const tableData = [];
  481 | 
  482 |     console.log(`Found ${tableRows.length} rows in Details table`);
  483 | 
  484 |     for (let i = 0; i < tableRows.length; i++) {
  485 |       // Get cells in the current row
  486 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  487 | 
  488 |       if (cells.length >= 5) {
  489 |         const getCellValue = async (cell: Locator): Promise<string> => {
  490 |           const inputCount = await cell.locator('input').count();
  491 |           if (inputCount > 0) {
  492 |             try {
  493 |               return await cell.locator('input').first().inputValue();
  494 |             } catch {
  495 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  496 |             }
  497 |           }
  498 |           return (await cell.textContent())?.trim() ?? '';
  499 |         };
  500 | 
  501 |         const poNo        = await getCellValue(cells[0]);
  502 |         const countryCode = await getCellValue(cells[1]);
  503 |         const partNo      = await getCellValue(cells[2]);
  504 |         const qty         = await getCellValue(cells[3]);
  505 |         const total       = await getCellValue(cells[4]);
  506 | 
  507 |         tableData.push({
  508 |           poNo: poNo?.trim() || '',
  509 |           countryCode: countryCode?.trim() || '',
  510 |           partNo: partNo?.trim() || '',
  511 |           qty: qty?.trim() || '',
  512 |           total: total?.trim() || ''
  513 |         });
  514 | 
  515 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  516 |       }
  517 |     }
  518 | 
  519 |     return tableData;
  520 |   }
  521 | 
  522 |   async waitForSuccessMessage() {
  523 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  524 |   }
  525 | 
  526 |   async isSuccessMessageVisible(): Promise<boolean> {
  527 |     return await this.successMessage.isVisible();
  528 |   }
  529 | 
  530 |   async getSuccessMessage(): Promise<string> {
  531 |     return await this.successMessage.textContent() || '';
  532 |   }
  533 | 
  534 |   // Helper method to safely get field value with fallbacks
  535 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  536 |     try {
  537 |       const count = await locator.count();
  538 |       if (count === 0) {
  539 |         console.log(`Field "${fieldName}" not found with selector`);
  540 |         return '';
  541 |       }
  542 | 
  543 |       // Try inputValue() first (works for input elements)
  544 |       try {
  545 |         const value = await locator.inputValue();
  546 |         if (value) {
  547 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  548 |           return value;
  549 |         }
  550 |       } catch (e) {
  551 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  552 |       }
  553 | 
  554 |       // Fallback to getAttribute('value')
  555 |       const attrValue = await locator.getAttribute('value');
  556 |       if (attrValue) {
  557 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  558 |         return attrValue;
  559 |       }
  560 | 
  561 |       // Fallback to textContent for read-only fields
  562 |       const textValue = await locator.textContent();
  563 |       if (textValue) {
  564 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  565 |         return textValue.trim();
  566 |       }
  567 | 
```