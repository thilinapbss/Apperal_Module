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
  376 |     // Press Page Down for each expected row to load them all
  377 |     console.log(`🔄 Loading rows: Pressing Page Down ${expectedRowCount} times...\n`);
  378 |     for (let i = 0; i < expectedRowCount; i++) {
  379 |       await this.page.keyboard.press('PageDown');
  380 |       await this.page.waitForTimeout(300);
  381 |       console.log(`Press ${i + 1}/${expectedRowCount}`);
  382 |     }
  383 | 
  384 |     console.log(`\n✓ All Page Down presses completed`);
  385 | 
  386 |     // Get all table rows in the Details table
  387 |     let tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  388 |     const tableData = [];
  389 | 
  390 |     console.log(`Found ${tableRows.length} total rows in Details table, capturing all...`);
  391 | 
  392 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  393 |     const getCellValue = async (cell: Locator): Promise<string> => {
  394 |       const inputCount = await cell.locator('input').count();
  395 |       if (inputCount > 0) {
  396 |         try {
  397 |           return await cell.locator('input').first().inputValue();
  398 |         } catch {
  399 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  400 |         }
  401 |       }
  402 |       return (await cell.textContent())?.trim() ?? '';
  403 |     };
  404 | 
  405 |     for (let i = 0; i < tableRows.length; i++) {
  406 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  407 | 
  408 |       if (cells.length > 0) {
  409 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  410 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  411 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  412 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  413 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  414 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  415 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  416 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  417 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  418 | 
  419 |         // Capture all rows with any data (including total/summary rows)
  420 |         if (poNo || partNo || qty || total || countryCode) {
  421 |           tableData.push({
  422 |             poNo: poNo?.trim() || '',
  423 |             countryCode: countryCode?.trim() || '',
  424 |             partNo: partNo?.trim() || '',
  425 |             qty: qty?.trim() || '',
  426 |             total: total?.trim() || '',
  427 |             deliveryNo: deliveryNo?.trim() || '',
  428 |             deliveryDate: deliveryDate?.trim() || '',
  429 |             pcdDate: pcdDate?.trim() || '',
  430 |             fobDate: fobDate?.trim() || ''
  431 |           });
  432 |         }
  433 |       }
  434 |     }
  435 | 
  436 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  437 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  438 | 
  439 |     if (tableData.length === expectedRowCount) {
  440 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  441 |     } else if (tableData.length > 0) {
  442 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  443 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  444 |     } else {
  445 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  446 |     }
  447 | 
  448 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  449 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  450 |     console.log(`------|-------|---------|---------|-----|-------`);
  451 |     tableData.forEach((row, index) => {
  452 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  453 |     });
  454 |     console.log(`=============================\n`);
  455 | 
  456 |     // Throw error if we didn't get all expected rows
  457 |     if (tableData.length !== expectedRowCount) {
> 458 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  459 |     }
  460 | 
  461 |     return tableData;
  462 |   }
  463 | 
  464 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  465 |     // Wait for the Details table to be visible
  466 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  467 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  468 | 
  469 |     // Get all table rows in the Details table
  470 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  471 |     const tableData = [];
  472 | 
  473 |     console.log(`Found ${tableRows.length} rows in Details table`);
  474 | 
  475 |     for (let i = 0; i < tableRows.length; i++) {
  476 |       // Get cells in the current row
  477 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  478 | 
  479 |       if (cells.length >= 5) {
  480 |         const getCellValue = async (cell: Locator): Promise<string> => {
  481 |           const inputCount = await cell.locator('input').count();
  482 |           if (inputCount > 0) {
  483 |             try {
  484 |               return await cell.locator('input').first().inputValue();
  485 |             } catch {
  486 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  487 |             }
  488 |           }
  489 |           return (await cell.textContent())?.trim() ?? '';
  490 |         };
  491 | 
  492 |         const poNo        = await getCellValue(cells[0]);
  493 |         const countryCode = await getCellValue(cells[1]);
  494 |         const partNo      = await getCellValue(cells[2]);
  495 |         const qty         = await getCellValue(cells[3]);
  496 |         const total       = await getCellValue(cells[4]);
  497 | 
  498 |         tableData.push({
  499 |           poNo: poNo?.trim() || '',
  500 |           countryCode: countryCode?.trim() || '',
  501 |           partNo: partNo?.trim() || '',
  502 |           qty: qty?.trim() || '',
  503 |           total: total?.trim() || ''
  504 |         });
  505 | 
  506 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  507 |       }
  508 |     }
  509 | 
  510 |     return tableData;
  511 |   }
  512 | 
  513 |   async waitForSuccessMessage() {
  514 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  515 |   }
  516 | 
  517 |   async isSuccessMessageVisible(): Promise<boolean> {
  518 |     return await this.successMessage.isVisible();
  519 |   }
  520 | 
  521 |   async getSuccessMessage(): Promise<string> {
  522 |     return await this.successMessage.textContent() || '';
  523 |   }
  524 | 
  525 |   // Helper method to safely get field value with fallbacks
  526 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  527 |     try {
  528 |       const count = await locator.count();
  529 |       if (count === 0) {
  530 |         console.log(`Field "${fieldName}" not found with selector`);
  531 |         return '';
  532 |       }
  533 | 
  534 |       // Try inputValue() first (works for input elements)
  535 |       try {
  536 |         const value = await locator.inputValue();
  537 |         if (value) {
  538 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  539 |           return value;
  540 |         }
  541 |       } catch (e) {
  542 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  543 |       }
  544 | 
  545 |       // Fallback to getAttribute('value')
  546 |       const attrValue = await locator.getAttribute('value');
  547 |       if (attrValue) {
  548 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  549 |         return attrValue;
  550 |       }
  551 | 
  552 |       // Fallback to textContent for read-only fields
  553 |       const textValue = await locator.textContent();
  554 |       if (textValue) {
  555 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  556 |         return textValue.trim();
  557 |       }
  558 | 
```