# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 08. TC-BPO-005 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:368:10

# Error details

```
Error: Failed to capture all line items. Expected 3 rows but got 0 rows. Please scroll down to load all rows.
```

# Test source

```ts
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
  460 |       }
  461 |     }
  462 | 
  463 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  464 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  465 | 
  466 |     if (tableData.length === expectedRowCount) {
  467 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  468 |     } else if (tableData.length > 0) {
  469 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  470 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  471 |     } else {
  472 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  473 |     }
  474 | 
  475 |     console.log(`\n════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
  476 |     console.log(`📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  477 |     console.log(`════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
  478 | 
  479 |     console.log(`\nRow # | PO No        | Country | Part No    | Qty        | Total      | Delivery No     | Delivery Date   | PCD Date        | FOB Date`);
  480 |     console.log(`──────┼──────────────┼─────────┼────────────┼────────────┼────────────┼─────────────────┼─────────────────┼─────────────────┼──────────────`);
  481 | 
  482 |     tableData.forEach((row, index) => {
  483 |       const rowNum = (index + 1).toString().padEnd(4);
  484 |       const poNo = row.poNo.padEnd(12);
  485 |       const country = row.countryCode.padEnd(7);
  486 |       const partNo = row.partNo.padEnd(10);
  487 |       const qty = row.qty.padEnd(10);
  488 |       const total = row.total.padEnd(10);
  489 |       const deliveryNo = row.deliveryNo.padEnd(15);
  490 |       const deliveryDate = row.deliveryDate.padEnd(15);
  491 |       const pcdDate = row.pcdDate.padEnd(15);
  492 |       const fobDate = row.fobDate.padEnd(10);
  493 | 
  494 |       console.log(`${rowNum} | ${poNo} | ${country} | ${partNo} | ${qty} | ${total} | ${deliveryNo} | ${deliveryDate} | ${pcdDate} | ${fobDate}`);
  495 |     });
  496 | 
  497 |     console.log(`════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`);
  498 | 
  499 |     console.log(`\n✓ Line Items Summary:`);
  500 |     console.log(`  • Total Rows Captured: ${tableData.length}`);
  501 |     console.log(`  • Expected Rows: ${expectedRowCount}`);
  502 |     console.log(`  • Status: ${tableData.length === expectedRowCount ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
  503 |     console.log(``);
  504 | 
  505 |     // Throw error if we didn't get all expected rows
  506 |     if (tableData.length !== expectedRowCount) {
> 507 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 3 rows but got 0 rows. Please scroll down to load all rows.
  508 |     }
  509 | 
  510 |     return tableData;
  511 |   }
  512 | 
  513 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  514 |     // Wait for the Details table to be visible
  515 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  516 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  517 | 
  518 |     // Get all table rows in the Details table
  519 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  520 |     const tableData = [];
  521 | 
  522 |     console.log(`Found ${tableRows.length} rows in Details table`);
  523 | 
  524 |     for (let i = 0; i < tableRows.length; i++) {
  525 |       // Get cells in the current row
  526 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  527 | 
  528 |       if (cells.length >= 5) {
  529 |         const getCellValue = async (cell: Locator): Promise<string> => {
  530 |           const inputCount = await cell.locator('input').count();
  531 |           if (inputCount > 0) {
  532 |             try {
  533 |               return await cell.locator('input').first().inputValue();
  534 |             } catch {
  535 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  536 |             }
  537 |           }
  538 |           return (await cell.textContent())?.trim() ?? '';
  539 |         };
  540 | 
  541 |         const poNo        = await getCellValue(cells[0]);
  542 |         const countryCode = await getCellValue(cells[1]);
  543 |         const partNo      = await getCellValue(cells[2]);
  544 |         const qty         = await getCellValue(cells[3]);
  545 |         const total       = await getCellValue(cells[4]);
  546 | 
  547 |         tableData.push({
  548 |           poNo: poNo?.trim() || '',
  549 |           countryCode: countryCode?.trim() || '',
  550 |           partNo: partNo?.trim() || '',
  551 |           qty: qty?.trim() || '',
  552 |           total: total?.trim() || ''
  553 |         });
  554 | 
  555 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  556 |       }
  557 |     }
  558 | 
  559 |     return tableData;
  560 |   }
  561 | 
  562 |   async waitForSuccessMessage() {
  563 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  564 |   }
  565 | 
  566 |   async isSuccessMessageVisible(): Promise<boolean> {
  567 |     return await this.successMessage.isVisible();
  568 |   }
  569 | 
  570 |   async getSuccessMessage(): Promise<string> {
  571 |     return await this.successMessage.textContent() || '';
  572 |   }
  573 | 
  574 |   // Helper method to safely get field value with fallbacks
  575 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  576 |     try {
  577 |       const count = await locator.count();
  578 |       if (count === 0) {
  579 |         console.log(`Field "${fieldName}" not found with selector`);
  580 |         return '';
  581 |       }
  582 | 
  583 |       // Try inputValue() first (works for input elements)
  584 |       try {
  585 |         const value = await locator.inputValue();
  586 |         if (value) {
  587 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  588 |           return value;
  589 |         }
  590 |       } catch (e) {
  591 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  592 |       }
  593 | 
  594 |       // Fallback to getAttribute('value')
  595 |       const attrValue = await locator.getAttribute('value');
  596 |       if (attrValue) {
  597 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  598 |         return attrValue;
  599 |       }
  600 | 
  601 |       // Fallback to textContent for read-only fields
  602 |       const textValue = await locator.textContent();
  603 |       if (textValue) {
  604 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  605 |         return textValue.trim();
  606 |       }
  607 | 
```