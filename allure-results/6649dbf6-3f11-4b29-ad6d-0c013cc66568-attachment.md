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
  397 |         console.log(`Press ${pageDownCount}: ${currentRowCount}/${expectedRowCount} rows loaded`);
  398 |       }
  399 | 
  400 |       // If we've reached the expected count, we're done
  401 |       if (currentRowCount >= expectedRowCount) {
  402 |         console.log(`\n✅ SUCCESS! All ${expectedRowCount} rows loaded!`);
  403 |         break;
  404 |       }
  405 | 
  406 |       // If no new rows loaded and we've tried enough times
  407 |       if (currentRowCount === previousRowCount && previousRowCount > 0 && pageDownCount > 10) {
  408 |         console.log(`\n⚠️ No new rows after ${pageDownCount} Page Down presses. Stuck at ${currentRowCount}/${expectedRowCount}`);
  409 |         if (pageDownCount > 20) {
  410 |           console.log(`❌ FAILED - Max attempts reached`);
  411 |           break;
  412 |         }
  413 |       }
  414 | 
  415 |       previousRowCount = currentRowCount;
  416 |       pageDownCount++;
  417 | 
  418 |       // Press Page Down to load next row
  419 |       await this.page.keyboard.press('PageDown');
  420 |       await this.page.waitForTimeout(300);
  421 |     }
  422 | 
  423 |     console.log(`\n✓ Row loading completed: ${pageDownCount} Page Down presses, ${previousRowCount} rows found`);
  424 | 
  425 |     // Get all table rows in the Details table
  426 |     let tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  427 |     const tableData = [];
  428 | 
  429 |     console.log(`Found ${tableRows.length} total rows in Details table, capturing all...`);
  430 | 
  431 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  432 |     const getCellValue = async (cell: Locator): Promise<string> => {
  433 |       const inputCount = await cell.locator('input').count();
  434 |       if (inputCount > 0) {
  435 |         try {
  436 |           return await cell.locator('input').first().inputValue();
  437 |         } catch {
  438 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  439 |         }
  440 |       }
  441 |       return (await cell.textContent())?.trim() ?? '';
  442 |     };
  443 | 
  444 |     for (let i = 0; i < tableRows.length; i++) {
  445 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  446 | 
  447 |       if (cells.length > 0) {
  448 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  449 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  450 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  451 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  452 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  453 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  454 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  455 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  456 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  457 | 
  458 |         // Capture all rows with any data (including total/summary rows)
  459 |         if (poNo || partNo || qty || total || countryCode) {
  460 |           tableData.push({
  461 |             poNo: poNo?.trim() || '',
  462 |             countryCode: countryCode?.trim() || '',
  463 |             partNo: partNo?.trim() || '',
  464 |             qty: qty?.trim() || '',
  465 |             total: total?.trim() || '',
  466 |             deliveryNo: deliveryNo?.trim() || '',
  467 |             deliveryDate: deliveryDate?.trim() || '',
  468 |             pcdDate: pcdDate?.trim() || '',
  469 |             fobDate: fobDate?.trim() || ''
  470 |           });
  471 |         }
  472 |       }
  473 |     }
  474 | 
  475 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  476 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  477 | 
  478 |     if (tableData.length === expectedRowCount) {
  479 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  480 |     } else if (tableData.length > 0) {
  481 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  482 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  483 |     } else {
  484 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  485 |     }
  486 | 
  487 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  488 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  489 |     console.log(`------|-------|---------|---------|-----|-------`);
  490 |     tableData.forEach((row, index) => {
  491 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  492 |     });
  493 |     console.log(`=============================\n`);
  494 | 
  495 |     // Throw error if we didn't get all expected rows
  496 |     if (tableData.length !== expectedRowCount) {
> 497 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  498 |     }
  499 | 
  500 |     return tableData;
  501 |   }
  502 | 
  503 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  504 |     // Wait for the Details table to be visible
  505 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  506 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  507 | 
  508 |     // Get all table rows in the Details table
  509 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  510 |     const tableData = [];
  511 | 
  512 |     console.log(`Found ${tableRows.length} rows in Details table`);
  513 | 
  514 |     for (let i = 0; i < tableRows.length; i++) {
  515 |       // Get cells in the current row
  516 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  517 | 
  518 |       if (cells.length >= 5) {
  519 |         const getCellValue = async (cell: Locator): Promise<string> => {
  520 |           const inputCount = await cell.locator('input').count();
  521 |           if (inputCount > 0) {
  522 |             try {
  523 |               return await cell.locator('input').first().inputValue();
  524 |             } catch {
  525 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  526 |             }
  527 |           }
  528 |           return (await cell.textContent())?.trim() ?? '';
  529 |         };
  530 | 
  531 |         const poNo        = await getCellValue(cells[0]);
  532 |         const countryCode = await getCellValue(cells[1]);
  533 |         const partNo      = await getCellValue(cells[2]);
  534 |         const qty         = await getCellValue(cells[3]);
  535 |         const total       = await getCellValue(cells[4]);
  536 | 
  537 |         tableData.push({
  538 |           poNo: poNo?.trim() || '',
  539 |           countryCode: countryCode?.trim() || '',
  540 |           partNo: partNo?.trim() || '',
  541 |           qty: qty?.trim() || '',
  542 |           total: total?.trim() || ''
  543 |         });
  544 | 
  545 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  546 |       }
  547 |     }
  548 | 
  549 |     return tableData;
  550 |   }
  551 | 
  552 |   async waitForSuccessMessage() {
  553 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  554 |   }
  555 | 
  556 |   async isSuccessMessageVisible(): Promise<boolean> {
  557 |     return await this.successMessage.isVisible();
  558 |   }
  559 | 
  560 |   async getSuccessMessage(): Promise<string> {
  561 |     return await this.successMessage.textContent() || '';
  562 |   }
  563 | 
  564 |   // Helper method to safely get field value with fallbacks
  565 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  566 |     try {
  567 |       const count = await locator.count();
  568 |       if (count === 0) {
  569 |         console.log(`Field "${fieldName}" not found with selector`);
  570 |         return '';
  571 |       }
  572 | 
  573 |       // Try inputValue() first (works for input elements)
  574 |       try {
  575 |         const value = await locator.inputValue();
  576 |         if (value) {
  577 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  578 |           return value;
  579 |         }
  580 |       } catch (e) {
  581 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  582 |       }
  583 | 
  584 |       // Fallback to getAttribute('value')
  585 |       const attrValue = await locator.getAttribute('value');
  586 |       if (attrValue) {
  587 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  588 |         return attrValue;
  589 |       }
  590 | 
  591 |       // Fallback to textContent for read-only fields
  592 |       const textValue = await locator.textContent();
  593 |       if (textValue) {
  594 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  595 |         return textValue.trim();
  596 |       }
  597 | 
```