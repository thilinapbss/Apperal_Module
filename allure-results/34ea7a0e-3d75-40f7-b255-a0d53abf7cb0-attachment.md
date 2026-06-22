# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:346:10

# Error details

```
Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
```

# Test source

```ts
  406 |         console.log(`Press ${pageDownCount}: ${currentRowCount}/${expectedRowCount} rows loaded`);
  407 |       }
  408 | 
  409 |       // If we've reached the expected count, we're done
  410 |       if (currentRowCount >= expectedRowCount) {
  411 |         console.log(`\n✅ SUCCESS! All ${expectedRowCount} rows loaded!`);
  412 |         break;
  413 |       }
  414 | 
  415 |       // If no new rows loaded and we've tried enough times
  416 |       if (currentRowCount === previousRowCount && previousRowCount > 0 && pageDownCount > 10) {
  417 |         console.log(`\n⚠️ No new rows after ${pageDownCount} Page Down presses. Stuck at ${currentRowCount}/${expectedRowCount}`);
  418 |         if (pageDownCount > 20) {
  419 |           console.log(`❌ FAILED - Max attempts reached`);
  420 |           break;
  421 |         }
  422 |       }
  423 | 
  424 |       previousRowCount = currentRowCount;
  425 |       pageDownCount++;
  426 | 
  427 |       // Press Page Down to load next row
  428 |       await this.page.keyboard.press('PageDown');
  429 |       await this.page.waitForTimeout(300);
  430 |     }
  431 | 
  432 |     console.log(`\n✓ Row loading completed: ${pageDownCount} Page Down presses, ${previousRowCount} rows found`);
  433 | 
  434 |     // Get all table rows in the Details table
  435 |     let tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  436 |     const tableData = [];
  437 | 
  438 |     console.log(`Found ${tableRows.length} total rows in Details table, capturing all...`);
  439 | 
  440 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  441 |     const getCellValue = async (cell: Locator): Promise<string> => {
  442 |       const inputCount = await cell.locator('input').count();
  443 |       if (inputCount > 0) {
  444 |         try {
  445 |           return await cell.locator('input').first().inputValue();
  446 |         } catch {
  447 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  448 |         }
  449 |       }
  450 |       return (await cell.textContent())?.trim() ?? '';
  451 |     };
  452 | 
  453 |     for (let i = 0; i < tableRows.length; i++) {
  454 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  455 | 
  456 |       if (cells.length > 0) {
  457 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  458 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  459 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  460 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  461 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  462 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  463 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  464 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  465 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  466 | 
  467 |         // Capture all rows with any data (including total/summary rows)
  468 |         if (poNo || partNo || qty || total || countryCode) {
  469 |           tableData.push({
  470 |             poNo: poNo?.trim() || '',
  471 |             countryCode: countryCode?.trim() || '',
  472 |             partNo: partNo?.trim() || '',
  473 |             qty: qty?.trim() || '',
  474 |             total: total?.trim() || '',
  475 |             deliveryNo: deliveryNo?.trim() || '',
  476 |             deliveryDate: deliveryDate?.trim() || '',
  477 |             pcdDate: pcdDate?.trim() || '',
  478 |             fobDate: fobDate?.trim() || ''
  479 |           });
  480 |         }
  481 |       }
  482 |     }
  483 | 
  484 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  485 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  486 | 
  487 |     if (tableData.length === expectedRowCount) {
  488 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  489 |     } else if (tableData.length > 0) {
  490 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  491 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  492 |     } else {
  493 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  494 |     }
  495 | 
  496 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  497 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  498 |     console.log(`------|-------|---------|---------|-----|-------`);
  499 |     tableData.forEach((row, index) => {
  500 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  501 |     });
  502 |     console.log(`=============================\n`);
  503 | 
  504 |     // Throw error if we didn't get all expected rows
  505 |     if (tableData.length !== expectedRowCount) {
> 506 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  507 |     }
  508 | 
  509 |     return tableData;
  510 |   }
  511 | 
  512 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  513 |     // Wait for the Details table to be visible
  514 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  515 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  516 | 
  517 |     // Get all table rows in the Details table
  518 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  519 |     const tableData = [];
  520 | 
  521 |     console.log(`Found ${tableRows.length} rows in Details table`);
  522 | 
  523 |     for (let i = 0; i < tableRows.length; i++) {
  524 |       // Get cells in the current row
  525 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  526 | 
  527 |       if (cells.length >= 5) {
  528 |         const getCellValue = async (cell: Locator): Promise<string> => {
  529 |           const inputCount = await cell.locator('input').count();
  530 |           if (inputCount > 0) {
  531 |             try {
  532 |               return await cell.locator('input').first().inputValue();
  533 |             } catch {
  534 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  535 |             }
  536 |           }
  537 |           return (await cell.textContent())?.trim() ?? '';
  538 |         };
  539 | 
  540 |         const poNo        = await getCellValue(cells[0]);
  541 |         const countryCode = await getCellValue(cells[1]);
  542 |         const partNo      = await getCellValue(cells[2]);
  543 |         const qty         = await getCellValue(cells[3]);
  544 |         const total       = await getCellValue(cells[4]);
  545 | 
  546 |         tableData.push({
  547 |           poNo: poNo?.trim() || '',
  548 |           countryCode: countryCode?.trim() || '',
  549 |           partNo: partNo?.trim() || '',
  550 |           qty: qty?.trim() || '',
  551 |           total: total?.trim() || ''
  552 |         });
  553 | 
  554 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  555 |       }
  556 |     }
  557 | 
  558 |     return tableData;
  559 |   }
  560 | 
  561 |   async waitForSuccessMessage() {
  562 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  563 |   }
  564 | 
  565 |   async isSuccessMessageVisible(): Promise<boolean> {
  566 |     return await this.successMessage.isVisible();
  567 |   }
  568 | 
  569 |   async getSuccessMessage(): Promise<string> {
  570 |     return await this.successMessage.textContent() || '';
  571 |   }
  572 | 
  573 |   // Helper method to safely get field value with fallbacks
  574 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  575 |     try {
  576 |       const count = await locator.count();
  577 |       if (count === 0) {
  578 |         console.log(`Field "${fieldName}" not found with selector`);
  579 |         return '';
  580 |       }
  581 | 
  582 |       // Try inputValue() first (works for input elements)
  583 |       try {
  584 |         const value = await locator.inputValue();
  585 |         if (value) {
  586 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  587 |           return value;
  588 |         }
  589 |       } catch (e) {
  590 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  591 |       }
  592 | 
  593 |       // Fallback to getAttribute('value')
  594 |       const attrValue = await locator.getAttribute('value');
  595 |       if (attrValue) {
  596 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  597 |         return attrValue;
  598 |       }
  599 | 
  600 |       // Fallback to textContent for read-only fields
  601 |       const textValue = await locator.textContent();
  602 |       if (textValue) {
  603 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  604 |         return textValue.trim();
  605 |       }
  606 | 
```