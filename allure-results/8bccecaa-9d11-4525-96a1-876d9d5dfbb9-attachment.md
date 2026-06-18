# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 25. Verify saved record appears in the Buyer PO Upload list
- Location: e2e\apparel_regression_testing.spec.ts:447:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[id*="BuyerPoUploadHeaderList"][id*="LineItem-innerTable-listUl"]') to be visible
    32 × locator resolved to hidden <table role="grid" tabindex="0" aria-colcount="6" aria-rowcount="14" aria-multiselectable="true" aria-roledescription="Responsive Table" id="apperal.buyerpoupload::BuyerPoUploadHeaderList--fe::table::BuyerPoUploadHeader::LineItem-innerTable-listUl" aria-labelledby="apperal.buyerpoupload::BuyerPoUploadHeaderList--fe::table::BuyerPoUploadHeader::LineItem-title" class="sapMListTbl sapMListTblHasNav sapMListUl sapMListHighlight sapMListShowSeparatorsAll sapMListModeMultiSelect sapMListNavigated sapMPlugi…>…</table>

```

# Test source

```ts
  511 |   }
  512 | 
  513 |   async getStyleColorValue(): Promise<string> {
  514 |     return await this.getFieldValue(this.styleColorInput, 'StyleColor');
  515 |   }
  516 | 
  517 |   async getSeasonValue(): Promise<string> {
  518 |     return await this.getFieldValue(this.seasonInput, 'Season');
  519 |   }
  520 | 
  521 |   async enterRemark(remark: string) {
  522 |     await this.remarkInput.fill(remark);
  523 |   }
  524 | 
  525 |   async getRemarkValue(): Promise<string> {
  526 |     return await this.getFieldValue(this.remarkInput, 'Remark');
  527 |   }
  528 | 
  529 |   async verifyDataLoaded(expectedData: { buyer?: string; styleNo?: string; styleDescription?: string; styleColor?: string; season?: string }): Promise<boolean> {
  530 |     try {
  531 |       if (expectedData.buyer) {
  532 |         const buyerValue = await this.getBuyerValue();
  533 |         if (buyerValue !== expectedData.buyer) {
  534 |           console.log(`Buyer mismatch: expected "${expectedData.buyer}", got "${buyerValue}"`);
  535 |           return false;
  536 |         }
  537 |       }
  538 | 
  539 |       if (expectedData.styleNo) {
  540 |         const styleNoValue = await this.getStyleNoValue();
  541 |         if (styleNoValue !== expectedData.styleNo) {
  542 |           console.log(`Style No mismatch: expected "${expectedData.styleNo}", got "${styleNoValue}"`);
  543 |           return false;
  544 |         }
  545 |       }
  546 | 
  547 |       if (expectedData.styleDescription) {
  548 |         const styleDescValue = await this.getStyleDescriptionValue();
  549 |         if (styleDescValue !== expectedData.styleDescription) {
  550 |           console.log(`Style Description mismatch: expected "${expectedData.styleDescription}", got "${styleDescValue}"`);
  551 |           return false;
  552 |         }
  553 |       }
  554 | 
  555 |       if (expectedData.styleColor) {
  556 |         const styleColorValue = await this.getStyleColorValue();
  557 |         if (styleColorValue !== expectedData.styleColor) {
  558 |           console.log(`Style Color mismatch: expected "${expectedData.styleColor}", got "${styleColorValue}"`);
  559 |           return false;
  560 |         }
  561 |       }
  562 | 
  563 |       if (expectedData.season) {
  564 |         const seasonValue = await this.getSeasonValue();
  565 |         if (seasonValue !== expectedData.season) {
  566 |           console.log(`Season mismatch: expected "${expectedData.season}", got "${seasonValue}"`);
  567 |           return false;
  568 |         }
  569 |       }
  570 | 
  571 |       return true;
  572 |     } catch (error) {
  573 |       console.log(`Error verifying data: ${error}`);
  574 |       return false;
  575 |     }
  576 |   }
  577 | 
  578 |   async getSupplierCodeValue(): Promise<string> {
  579 |     return await this.getFieldValue(this.supplierCodeInput, 'SupplierCode');
  580 |   }
  581 | 
  582 |   async captureAllFormData(): Promise<{
  583 |     capturedAt: string;
  584 |     header: Record<string, string>;
  585 |     lineItems: Array<Record<string, string>>;
  586 |   }> {
  587 |     const header: Record<string, string> = {
  588 |       buyer:            await this.getBuyerValue(),
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
> 611 |     await this.page.waitForSelector(
      |                     ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
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
  667 | }
  668 | 
```