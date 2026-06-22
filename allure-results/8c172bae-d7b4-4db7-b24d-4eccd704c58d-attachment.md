# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:346:10

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[id*="GeneralInformation"][id*="Details2"][role="grid"]') to be visible

```

# Test source

```ts
  589 |       styleNo:          await this.getStyleNoValue(),
  590 |       styleDescription: await this.getStyleDescriptionValue(),
  591 |       styleColor:       await this.getStyleColorValue(),
  592 |       season:           await this.getSeasonValue(),
  593 |       supplierCode:     await this.getSupplierCodeValue(),
  594 |       poDate:           await this.getPODateValue(),
  595 |       kimbleNo:         await this.getKimbleNoValue(),
  596 |       remark:           await this.getRemarkValue(),
  597 |     };
  598 | 
  599 |     const lineItems = await this.captureLineItemsWithAllDetails();
  600 | 
  601 |     return {
  602 |       capturedAt: new Date().toISOString(),
  603 |       header,
  604 |       lineItems,
  605 |     };
  606 |   }
  607 | 
  608 |   async navigateBackToList() {
  609 |     const backButton = this.page.locator('[aria-label="Back"], [title="Back"]').first();
  610 |     await backButton.click();
  611 |     await this.page.waitForSelector(
  612 |       '[id*="BuyerPoUploadHeaderList"][id*="LineItem-innerTable-listUl"]',
  613 |       { timeout: 15000 }
  614 |     );
  615 |     await this.page.waitForLoadState('networkidle');
  616 |     // Allow SAP UI5 to finish rendering row data after navigation.
  617 |     await this.page.waitForTimeout(1500);
  618 |     console.log('✓ Navigated back to list page');
  619 |   }
  620 | 
  621 |   async verifyRecordInListTable(expected: {
  622 |     supplierCode?: string;
  623 |     poDate?: string;
  624 |     styleNo?: string;
  625 |     season?: string;
  626 |   }): Promise<{ found: boolean; matchCount: number; totalRows: number }> {
  627 |     const tableSelector = '[id*="BuyerPoUploadHeaderList"][id*="LineItem-innerTable-listUl"]';
  628 |     await this.page.waitForSelector(tableSelector, { timeout: 15000 });
  629 | 
  630 |     const rows = await this.page.locator(`${tableSelector} tbody tr[role="row"]`).all();
  631 |     const totalRows = rows.length;
  632 |     let matchCount = 0;
  633 | 
  634 |     // Read text directly from the td cell (works regardless of inner span class).
  635 |     const getCellText = async (row: Locator, columnKey: string): Promise<string> => {
  636 |       const cell = row.locator(`[data-sap-ui-column*="${columnKey}-innerColumn"]`);
  637 |       if (await cell.count() === 0) return '';
  638 |       return (await cell.textContent())?.trim() ?? '';
  639 |     };
  640 | 
  641 |     for (const row of rows) {
  642 |       const supplierText = await getCellText(row, 'SupplierCode');
  643 |       const poDateText   = await getCellText(row, 'PODate');
  644 |       const styleNoText  = await getCellText(row, 'StyleNo');
  645 |       const seasonText   = await getCellText(row, 'Season');
  646 | 
  647 |       const matches =
  648 |         (!expected.supplierCode || supplierText?.includes(expected.supplierCode)) &&
  649 |         (!expected.poDate       || poDateText?.includes(expected.poDate)) &&
  650 |         (!expected.styleNo      || styleNoText?.includes(expected.styleNo)) &&
  651 |         (!expected.season       || seasonText?.includes(expected.season));
  652 | 
  653 |       if (matches) {
  654 |         matchCount++;
  655 |         console.log(`  [Match ${matchCount}] Supplier: ${supplierText} | PO Date: ${poDateText} | Style No: ${styleNoText} | Season: ${seasonText}`);
  656 |       }
  657 |     }
  658 | 
  659 |     if (matchCount > 0) {
  660 |       console.log(`✓ Found ${matchCount} matching row(s) out of ${totalRows} total rows in list`);
  661 |     } else {
  662 |       console.log(`✗ No matching record found out of ${totalRows} rows. Expected:`, expected);
  663 |     }
  664 | 
  665 |     return { found: matchCount > 0, matchCount, totalRows };
  666 |   }
  667 | 
  668 |   async waitForToastAlert(timeout: number = 10000): Promise<string> {
  669 |     const alertLocator = this.page.locator('.sapMMessageToast[role="alert"]');
  670 |     await alertLocator.waitFor({ state: 'visible', timeout });
  671 |     const alertText = await alertLocator.textContent();
  672 |     console.log(`✓ Alert displayed: "${alertText?.trim()}"`);
  673 |     return alertText?.trim() || '';
  674 |   }
  675 | 
  676 |   async verifyToastAlert(expectedText: string, timeout: number = 10000): Promise<boolean> {
  677 |     const alertText = await this.waitForToastAlert(timeout);
  678 |     const matches = alertText.includes(expectedText);
  679 |     if (matches) {
  680 |       console.log(`✓ Alert verified: "${alertText}"`);
  681 |     } else {
  682 |       console.log(`✗ Alert text mismatch. Expected: "${expectedText}", Got: "${alertText}"`);
  683 |     }
  684 |     return matches;
  685 |   }
  686 | 
  687 |   async capturePOSizeBreakdownTable(): Promise<Array<{ poNo: string; size: string; quantity: string; amount: string }>> {
  688 |     const tableSelector = '[id*="GeneralInformation"][id*="Details2"][role="grid"]';
> 689 |     await this.page.waitForSelector(tableSelector, { timeout: 10000 });
      |                     ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  690 | 
  691 |     const tableRows = await this.page.locator(`${tableSelector} tbody tr[role="row"][data-sap-ui-rowindex]`).all();
  692 |     const tableData = [];
  693 | 
  694 |     console.log(`Capturing ${tableRows.length} rows from PO Size Breakdown table`);
  695 | 
  696 |     for (let i = 0; i < tableRows.length; i++) {
  697 |       const cells = await tableRows[i].locator('[role="gridcell"]').all();
  698 | 
  699 |       if (cells.length >= 4) {
  700 |         const getCellValue = async (cell: Locator): Promise<string> => {
  701 |           const inputCount = await cell.locator('input').count();
  702 |           if (inputCount > 0) {
  703 |             try {
  704 |               return await cell.locator('input').first().inputValue();
  705 |             } catch {
  706 |               return (await cell.locator('input').first().getAttribute('value')) ?? '';
  707 |             }
  708 |           }
  709 |           return (await cell.textContent())?.trim() ?? '';
  710 |         };
  711 | 
  712 |         const poNo     = await getCellValue(cells[0]);
  713 |         const size     = await getCellValue(cells[1]);
  714 |         const quantity = await getCellValue(cells[2]);
  715 |         const amount   = await getCellValue(cells[3]);
  716 | 
  717 |         if (poNo || size) {
  718 |           tableData.push({
  719 |             poNo: poNo?.trim() || '',
  720 |             size: size?.trim() || '',
  721 |             quantity: quantity?.trim() || '',
  722 |             amount: amount?.trim() || ''
  723 |           });
  724 |         }
  725 |       }
  726 |     }
  727 | 
  728 |     console.log('✓ PO Size Breakdown table captured');
  729 |     return tableData;
  730 |   }
  731 | }
  732 | 
```