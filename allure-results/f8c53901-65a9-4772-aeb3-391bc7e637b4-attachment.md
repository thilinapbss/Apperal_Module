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
  399 |         // Continue trying a few more times with more aggressive scrolling
  400 |         if (scrollAttempts > 15) {
  401 |           console.log(`❌ FAILED TO LOAD ALL ROWS - Max scroll attempts reached`);
  402 |           break;
  403 |         }
  404 |       }
  405 | 
  406 |       previousRowCount = currentRowCount;
  407 |       scrollAttempts++;
  408 | 
  409 |       // Scroll tbody directly multiple times to trigger lazy loading
  410 |       await tableElement.evaluate((el) => {
  411 |         const scrollContainer = el.closest('.sapUiTableCtrlScroll') || el;
  412 |         const tbody = scrollContainer?.querySelector('tbody');
  413 |         if (tbody) {
  414 |           // Aggressive scrolling - scroll to bottom multiple times
  415 |           for (let j = 0; j < 3; j++) {
  416 |             tbody.scrollTop = tbody.scrollHeight + 2000;
  417 |           }
  418 |         }
  419 |       });
  420 | 
  421 |       // Wait for rows to render
  422 |       await this.page.waitForTimeout(400);
  423 |     }
  424 | 
  425 |     console.log(`✓ Scrolling completed: ${scrollAttempts} scroll attempts`);
  426 | 
  427 |     // Get all table rows in the Details table
  428 |     let tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  429 |     const tableData = [];
  430 | 
  431 |     console.log(`Found ${tableRows.length} total rows in Details table, capturing all...`);
  432 | 
  433 |     // Works in both edit mode (input elements) and display mode (span text) after save.
  434 |     const getCellValue = async (cell: Locator): Promise<string> => {
  435 |       const inputCount = await cell.locator('input').count();
  436 |       if (inputCount > 0) {
  437 |         try {
  438 |           return await cell.locator('input').first().inputValue();
  439 |         } catch {
  440 |           return (await cell.locator('input').first().getAttribute('value')) ?? '';
  441 |         }
  442 |       }
  443 |       return (await cell.textContent())?.trim() ?? '';
  444 |     };
  445 | 
  446 |     for (let i = 0; i < tableRows.length; i++) {
  447 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  448 | 
  449 |       if (cells.length > 0) {
  450 |         const poNo        = cells.length > 0 ? await getCellValue(cells[0]) : '';
  451 |         const countryCode = cells.length > 1 ? await getCellValue(cells[1]) : '';
  452 |         const partNo      = cells.length > 2 ? await getCellValue(cells[2]) : '';
  453 |         const qty         = cells.length > 3 ? await getCellValue(cells[3]) : '';
  454 |         const total       = cells.length > 4 ? await getCellValue(cells[4]) : '';
  455 |         const deliveryNo  = cells.length > 5 ? await getCellValue(cells[5]) : '';
  456 |         const deliveryDate = cells.length > 6 ? await getCellValue(cells[6]) : '';
  457 |         const pcdDate     = cells.length > 7 ? await getCellValue(cells[7]) : '';
  458 |         const fobDate     = cells.length > 8 ? await getCellValue(cells[8]) : '';
  459 | 
  460 |         // Capture all rows with any data (including total/summary rows)
  461 |         if (poNo || partNo || qty || total || countryCode) {
  462 |           tableData.push({
  463 |             poNo: poNo?.trim() || '',
  464 |             countryCode: countryCode?.trim() || '',
  465 |             partNo: partNo?.trim() || '',
  466 |             qty: qty?.trim() || '',
  467 |             total: total?.trim() || '',
  468 |             deliveryNo: deliveryNo?.trim() || '',
  469 |             deliveryDate: deliveryDate?.trim() || '',
  470 |             pcdDate: pcdDate?.trim() || '',
  471 |             fobDate: fobDate?.trim() || ''
  472 |           });
  473 |         }
  474 |       }
  475 |     }
  476 | 
  477 |     console.log(`\n✅ LINE ITEMS CAPTURE COMPLETE`);
  478 |     console.log(`Total rows captured: ${tableData.length}/${expectedRowCount}`);
  479 | 
  480 |     if (tableData.length === expectedRowCount) {
  481 |       console.log(`Status: ✅ SUCCESS - All ${expectedRowCount} rows captured`);
  482 |     } else if (tableData.length > 0) {
  483 |       console.log(`Status: ❌ ERROR - Only ${tableData.length}/${expectedRowCount} rows captured`);
  484 |       console.log(`Missing ${expectedRowCount - tableData.length} row(s)`);
  485 |     } else {
  486 |       console.log(`Status: ❌ CRITICAL ERROR - No rows captured!`);
  487 |     }
  488 | 
  489 |     console.log(`\n📋 ALL CAPTURED LINE ITEMS (${tableData.length}/${expectedRowCount})`);
  490 |     console.log(`Row # | PO No | Country | Part No | Qty | Total`);
  491 |     console.log(`------|-------|---------|---------|-----|-------`);
  492 |     tableData.forEach((row, index) => {
  493 |       console.log(`${index + 1}. | ${row.poNo} | ${row.countryCode} | ${row.partNo} | ${row.qty} | ${row.total}`);
  494 |     });
  495 |     console.log(`=============================\n`);
  496 | 
  497 |     // Throw error if we didn't get all expected rows
  498 |     if (tableData.length !== expectedRowCount) {
> 499 |       throw new Error(`Failed to capture all line items. Expected ${expectedRowCount} rows but got ${tableData.length} rows. Please scroll down to load all rows.`);
      |             ^ Error: Failed to capture all line items. Expected 6 rows but got 5 rows. Please scroll down to load all rows.
  500 |     }
  501 | 
  502 |     return tableData;
  503 |   }
  504 | 
  505 |   async verifyPOSizeBreakdownTableData(): Promise<{ poNo: string; countryCode: string; partNo: string; qty: string; total: string }[]> {
  506 |     // Wait for the Details table to be visible
  507 |     const tableSelector = '[id*="GeneralInformation"][id*="Details1"][role="grid"]';
  508 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
  509 | 
  510 |     // Get all table rows in the Details table
  511 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  512 |     const tableData = [];
  513 | 
  514 |     console.log(`Found ${tableRows.length} rows in Details table`);
  515 | 
  516 |     for (let i = 0; i < tableRows.length; i++) {
  517 |       // Get cells in the current row
  518 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  519 | 
  520 |       if (cells.length >= 5) {
  521 |         const getCellValue = async (cell: Locator): Promise<string> => {
  522 |           const inputCount = await cell.locator('input').count();
  523 |           if (inputCount > 0) {
  524 |             try {
  525 |               return await cell.locator('input').first().inputValue();
  526 |             } catch {
  527 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  528 |             }
  529 |           }
  530 |           return (await cell.textContent())?.trim() ?? '';
  531 |         };
  532 | 
  533 |         const poNo        = await getCellValue(cells[0]);
  534 |         const countryCode = await getCellValue(cells[1]);
  535 |         const partNo      = await getCellValue(cells[2]);
  536 |         const qty         = await getCellValue(cells[3]);
  537 |         const total       = await getCellValue(cells[4]);
  538 | 
  539 |         tableData.push({
  540 |           poNo: poNo?.trim() || '',
  541 |           countryCode: countryCode?.trim() || '',
  542 |           partNo: partNo?.trim() || '',
  543 |           qty: qty?.trim() || '',
  544 |           total: total?.trim() || ''
  545 |         });
  546 | 
  547 |         console.log(`Row ${i}: PO No="${poNo}", Country="${countryCode}", Part No="${partNo}", Qty="${qty}", Total="${total}"`);
  548 |       }
  549 |     }
  550 | 
  551 |     return tableData;
  552 |   }
  553 | 
  554 |   async waitForSuccessMessage() {
  555 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  556 |   }
  557 | 
  558 |   async isSuccessMessageVisible(): Promise<boolean> {
  559 |     return await this.successMessage.isVisible();
  560 |   }
  561 | 
  562 |   async getSuccessMessage(): Promise<string> {
  563 |     return await this.successMessage.textContent() || '';
  564 |   }
  565 | 
  566 |   // Helper method to safely get field value with fallbacks
  567 |   private async getFieldValue(locator: Locator, fieldName: string): Promise<string> {
  568 |     try {
  569 |       const count = await locator.count();
  570 |       if (count === 0) {
  571 |         console.log(`Field "${fieldName}" not found with selector`);
  572 |         return '';
  573 |       }
  574 | 
  575 |       // Try inputValue() first (works for input elements)
  576 |       try {
  577 |         const value = await locator.inputValue();
  578 |         if (value) {
  579 |           console.log(`${fieldName} value (via inputValue): "${value}"`);
  580 |           return value;
  581 |         }
  582 |       } catch (e) {
  583 |         console.log(`inputValue() failed for ${fieldName}, trying getAttribute`);
  584 |       }
  585 | 
  586 |       // Fallback to getAttribute('value')
  587 |       const attrValue = await locator.getAttribute('value');
  588 |       if (attrValue) {
  589 |         console.log(`${fieldName} value (via getAttribute): "${attrValue}"`);
  590 |         return attrValue;
  591 |       }
  592 | 
  593 |       // Fallback to textContent for read-only fields
  594 |       const textValue = await locator.textContent();
  595 |       if (textValue) {
  596 |         console.log(`${fieldName} value (via textContent): "${textValue}"`);
  597 |         return textValue.trim();
  598 |       }
  599 | 
```