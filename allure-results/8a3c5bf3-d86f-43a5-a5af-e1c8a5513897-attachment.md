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
  403 |         // Continue trying a few more times with more aggressive scrolling
  404 |         if (scrollAttempts > 15) {
  405 |           console.log(`❌ FAILED TO LOAD ALL ROWS - Max scroll attempts reached`);
  406 |           break;
  407 |         }
  408 |       }
  409 | 
  410 |       previousRowCount = currentRowCount;
  411 |       scrollAttempts++;
  412 | 
  413 |       // Scroll tbody directly multiple times to trigger lazy loading
  414 |       await tableElement.evaluate((el) => {
  415 |         const scrollContainer = el.closest('.sapUiTableCtrlScroll') || el;
  416 |         const tbody = scrollContainer?.querySelector('tbody');
  417 |         if (tbody) {
  418 |           // Aggressive scrolling - scroll to bottom multiple times
  419 |           for (let j = 0; j < 3; j++) {
  420 |             tbody.scrollTop = tbody.scrollHeight + 2000;
  421 |           }
  422 |         }
  423 |       });
  424 | 
  425 |       // Wait for rows to render
  426 |       await this.page.waitForTimeout(400);
  427 |     }
  428 | 
  429 |     console.log(`✓ Scrolling completed: ${scrollAttempts} scroll attempts`);
  430 | 
  431 |     // Get all table rows in the Details table
  432 |     let tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  433 |     const tableData = [];
  434 | 
  435 |     console.log(`Found ${tableRows.length} total rows in Details table, capturing all...`);
  436 | 
  437 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  438 |     const getCellValue = async (cell: Locator): Promise<string> => {
  439 |       const inputCount = await cell.locator('input').count();
  440 |       if (inputCount > 0) {
  441 |         try {
  442 |           return await cell.locator('input').first().inputValue();
  443 |         } catch {
  444 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  445 |         }
  446 |       }
  447 |       return (await cell.textContent())?.trim() ?? '';
  448 |     };
  449 | 
  450 |     for (let i = 0; i < tableRows.length; i++) {
  451 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  452 | 
  453 |       if (cells.length > 0) {
  454 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  455 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  456 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  457 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  458 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  459 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  460 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  461 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  462 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  463 | 
  464 |         // Capture all rows with any data (including total/summary rows)
  465 |         if (poNo || partNo || qty || total || countryCode) {
  466 |           tableData.push({
  467 |             poNo: poNo?.trim() || '',
  468 |             countryCode: countryCode?.trim() || '',
  469 |             partNo: partNo?.trim() || '',
  470 |             qty: qty?.trim() || '',
  471 |             total: total?.trim() || '',
  472 |             deliveryNo: deliveryNo?.trim() || '',
  473 |             deliveryDate: deliveryDate?.trim() || '',
  474 |             pcdDate: pcdDate?.trim() || '',
  475 |             fobDate: fobDate?.trim() || ''
  476 |           });
  477 |         }
  478 |       }
  479 |     }
  480 | 
  481 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  482 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  483 | 
  484 |     if (tableData.length === expectedRowCount) {
  485 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  486 |     } else if (tableData.length > 0) {
  487 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  488 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  489 |     } else {
  490 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  491 |     }
  492 | 
  493 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  494 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  495 |     console.log(`------|-------|---------|---------|-----|-------`);
  496 |     tableData.forEach((row, index) => {
  497 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  498 |     });
  499 |     console.log(`=============================\n`);
  500 | 
  501 |     // Throw error if we didn't get all expected rows
  502 |     if (tableData.length !== expectedRowCount) {
> 503 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  504 |     }
  505 | 
  506 |     return tableData;
  507 |   }
  508 | 
  509 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  510 |     // Wait for the Details table to be visible
  511 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  512 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  513 | 
  514 |     // Get all table rows in the Details table
  515 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  516 |     const tableData = [];
  517 | 
  518 |     console.log(`Found ${tableRows.length} rows in Details table`);
  519 | 
  520 |     for (let i = 0; i < tableRows.length; i++) {
  521 |       // Get cells in the current row
  522 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  523 | 
  524 |       if (cells.length >= 5) {
  525 |         const getCellValue = async (cell: Locator): Promise<string> => {
  526 |           const inputCount = await cell.locator('input').count();
  527 |           if (inputCount > 0) {
  528 |             try {
  529 |               return await cell.locator('input').first().inputValue();
  530 |             } catch {
  531 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  532 |             }
  533 |           }
  534 |           return (await cell.textContent())?.trim() ?? '';
  535 |         };
  536 | 
  537 |         const poNo        = await getCellValue(cells[0]);
  538 |         const countryCode = await getCellValue(cells[1]);
  539 |         const partNo      = await getCellValue(cells[2]);
  540 |         const qty         = await getCellValue(cells[3]);
  541 |         const total       = await getCellValue(cells[4]);
  542 | 
  543 |         tableData.push({
  544 |           poNo: poNo?.trim() || '',
  545 |           countryCode: countryCode?.trim() || '',
  546 |           partNo: partNo?.trim() || '',
  547 |           qty: qty?.trim() || '',
  548 |           total: total?.trim() || ''
  549 |         });
  550 | 
  551 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  552 |       }
  553 |     }
  554 | 
  555 |     return tableData;
  556 |   }
  557 | 
  558 |   async waitForSuccessMessage() {
  559 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  560 |   }
  561 | 
  562 |   async isSuccessMessageVisible(): Promise<boolean> {
  563 |     return await this.successMessage.isVisible();
  564 |   }
  565 | 
  566 |   async getSuccessMessage(): Promise<string> {
  567 |     return await this.successMessage.textContent() || '';
  568 |   }
  569 | 
  570 |   // Helper method to safely get field value with fallbacks
  571 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  572 |     try {
  573 |       const count = await locator.count();
  574 |       if (count === 0) {
  575 |         console.log(`Field "${fieldName}" not found with selector`);
  576 |         return '';
  577 |       }
  578 | 
  579 |       // Try inputValue() first (works for input elements)
  580 |       try {
  581 |         const value = await locator.inputValue();
  582 |         if (value) {
  583 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  584 |           return value;
  585 |         }
  586 |       } catch (e) {
  587 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  588 |       }
  589 | 
  590 |       // Fallback to getAttribute('value')
  591 |       const attrValue = await locator.getAttribute('value');
  592 |       if (attrValue) {
  593 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  594 |         return attrValue;
  595 |       }
  596 | 
  597 |       // Fallback to textContent for read-only fields
  598 |       const textValue = await locator.textContent();
  599 |       if (textValue) {
  600 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  601 |         return textValue.trim();
  602 |       }
  603 | 
```