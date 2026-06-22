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
  392 |     console.log(`🔄 Loading all rows (Down Arrow navigation + scroll into view):\n`);
  393 | 
  394 |     for (let rowIndex = 0; rowIndex < expectedRowCount; rowIndex++) {
  395 |       // Press Down arrow key once to move to next row
  396 |       console.log(`⬇️  Row ${rowIndex + 1}/${expectedRowCount} - Pressing Down arrow key...`);
  397 |       await this.page.keyboard.press('ArrowDown');
  398 |       await this.page.waitForTimeout(500);
  399 | 
  400 |       // Scroll the selected row into view to ensure it renders
  401 |       await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).first().evaluate((el) => {
  402 |         el.scrollIntoView({ behavior: 'auto', block: 'center' });
  403 |       }).catch(() => {});
  404 | 
  405 |       // Wait 3 seconds for row to render and load
  406 |       console.log(`⏳ Waiting 3 seconds for row to load...`);
  407 |       await this.page.waitForTimeout(3000);
  408 |     }
  409 | 
  410 |     console.log(`\n✓ All rows loaded via ArrowDown navigation\n`);
  411 | 
  412 |     // Now capture all rows from the fully loaded table
  413 |     console.log(`📋 Capturing all ${expectedRowCount} rows from table:\n`);
  414 | 
  415 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  416 | 
  417 |     for (let rowIndex = 0; rowIndex < tableRows.length && rowIndex < expectedRowCount; rowIndex++) {
  418 |       const row = tableRows[rowIndex];
  419 |       const cells = await row.locator('[role="gridcell"]').all();
  420 | 
  421 |       if (cells.length > 0) {
  422 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  423 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  424 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  425 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  426 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  427 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  428 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  429 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  430 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  431 | 
  432 |         // Capture row with any data
  433 |         if (poNo || partNo || qty || total || countryCode) {
  434 |           tableData.push({
  435 |             poNo: poNo?.trim() || '',
  436 |             countryCode: countryCode?.trim() || '',
  437 |             partNo: partNo?.trim() || '',
  438 |             qty: qty?.trim() || '',
  439 |             total: total?.trim() || '',
  440 |             deliveryNo: deliveryNo?.trim() || '',
  441 |             deliveryDate: deliveryDate?.trim() || '',
  442 |             pcdDate: pcdDate?.trim() || '',
  443 |             fobDate: fobDate?.trim() || ''
  444 |           });
  445 |           console.log(`✓ Row ${rowIndex + 1}: ${poNo} | ${countryCode} | ${partNo} | ${qty}`);
  446 |         }
  447 |       }
  448 |     }
  449 | 
  450 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  451 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  452 | 
  453 |     if (tableData.length === expectedRowCount) {
  454 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  455 |     } else if (tableData.length > 0) {
  456 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  457 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  458 |     } else {
  459 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  460 |     }
  461 | 
  462 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  463 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  464 |     console.log(`------|-------|---------|---------|-----|-------`);
  465 |     tableData.forEach((row, index) => {
  466 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  467 |     });
  468 |     console.log(`=============================\n`);
  469 | 
  470 |     // Throw error if we didn't get all expected rows
  471 |     if (tableData.length !== expectedRowCount) {
> 472 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  473 |     }
  474 | 
  475 |     return tableData;
  476 |   }
  477 | 
  478 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  479 |     // Wait for the Details table to be visible
  480 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  481 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  482 | 
  483 |     // Get all table rows in the Details table
  484 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  485 |     const tableData = [];
  486 | 
  487 |     console.log(`Found ${tableRows.length} rows in Details table`);
  488 | 
  489 |     for (let i = 0; i < tableRows.length; i++) {
  490 |       // Get cells in the current row
  491 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  492 | 
  493 |       if (cells.length >= 5) {
  494 |         const getCellValue = async (cell: Locator): Promise<string> => {
  495 |           const inputCount = await cell.locator('input').count();
  496 |           if (inputCount > 0) {
  497 |             try {
  498 |               return await cell.locator('input').first().inputValue();
  499 |             } catch {
  500 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  501 |             }
  502 |           }
  503 |           return (await cell.textContent())?.trim() ?? '';
  504 |         };
  505 | 
  506 |         const poNo        = await getCellValue(cells[0]);
  507 |         const countryCode = await getCellValue(cells[1]);
  508 |         const partNo      = await getCellValue(cells[2]);
  509 |         const qty         = await getCellValue(cells[3]);
  510 |         const total       = await getCellValue(cells[4]);
  511 | 
  512 |         tableData.push({
  513 |           poNo: poNo?.trim() || '',
  514 |           countryCode: countryCode?.trim() || '',
  515 |           partNo: partNo?.trim() || '',
  516 |           qty: qty?.trim() || '',
  517 |           total: total?.trim() || ''
  518 |         });
  519 | 
  520 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  521 |       }
  522 |     }
  523 | 
  524 |     return tableData;
  525 |   }
  526 | 
  527 |   async waitForSuccessMessage() {
  528 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  529 |   }
  530 | 
  531 |   async isSuccessMessageVisible(): Promise<boolean> {
  532 |     return await this.successMessage.isVisible();
  533 |   }
  534 | 
  535 |   async getSuccessMessage(): Promise<string> {
  536 |     return await this.successMessage.textContent() || '';
  537 |   }
  538 | 
  539 |   // Helper method to safely get field value with fallbacks
  540 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  541 |     try {
  542 |       const count = await locator.count();
  543 |       if (count === 0) {
  544 |         console.log(`Field "${fieldName}" not found with selector`);
  545 |         return '';
  546 |       }
  547 | 
  548 |       // Try inputValue() first (works for input elements)
  549 |       try {
  550 |         const value = await locator.inputValue();
  551 |         if (value) {
  552 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  553 |           return value;
  554 |         }
  555 |       } catch (e) {
  556 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  557 |       }
  558 | 
  559 |       // Fallback to getAttribute('value')
  560 |       const attrValue = await locator.getAttribute('value');
  561 |       if (attrValue) {
  562 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  563 |         return attrValue;
  564 |       }
  565 | 
  566 |       // Fallback to textContent for read-only fields
  567 |       const textValue = await locator.textContent();
  568 |       if (textValue) {
  569 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  570 |         return textValue.trim();
  571 |       }
  572 | 
```