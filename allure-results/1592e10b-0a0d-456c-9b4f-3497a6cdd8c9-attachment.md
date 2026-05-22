# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 54. Fill Attachment Details section
- Location: e2e\apparel_regression_testing.spec.ts:860:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('div[id*="AttachmentDetails::LineItem-innerTable-tableCtrlCnt"]').locator('tbody tr[data-sap-ui-rowindex="1"]').first().locator('input[id*="__input"][id*="__clone"]').first()
    - locator resolved to <input value="" type="text" autocomplete="off" class="sapMInputBaseInner" id="__input1-__clone80-__clone179-inner" aria-labelledby="apperal.stylemaster::StyleMasterObjectPage--fe::table::AttachmentDetails::LineItem::C::DocName-innerColumn"/>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    49 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  366 | 
  367 |   async waitForPONumberDialogLoad() {
  368 |     await this.poNumberDialog.waitFor({ state: 'attached', timeout: 10000 });
  369 |     await this.page.waitForTimeout(500);
  370 |   }
  371 | 
  372 |   async selectPONumberByValue(poValue: string) {
  373 |     // Find the row index containing the PO number value
  374 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  375 |     const rowIndex = await allRows.filter({ hasText: poValue }).first().evaluate(el => {
  376 |       return el.getAttribute('data-sap-ui-rowindex');
  377 |     });
  378 | 
  379 |     // Click the row selector for this row
  380 |     const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${rowIndex}"]`);
  381 |     await rowSelector.click();
  382 |     await this.poNumberOkButton.click();
  383 |     await this.page.waitForLoadState('networkidle');
  384 |   }
  385 | 
  386 |   async selectFirstPONumber() {
  387 |     // Click the first row's selector
  388 |     const firstRowSelector = this.page.locator('[id*="Table-innerTable-rowsel0"]').first();
  389 |     await firstRowSelector.click();
  390 |     await this.poNumberOkButton.click();
  391 |     await this.page.waitForLoadState('networkidle');
  392 |   }
  393 | 
  394 |   async selectRandomPONumber() {
  395 |     // Get all PO number rows from the table
  396 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  397 |     const rowCount = await allRows.count();
  398 | 
  399 |     if (rowCount === 0) {
  400 |       throw new Error('No PO number rows found in the table');
  401 |     }
  402 | 
  403 |     // Select a random row (0 to rowCount-1)
  404 |     const randomIndex = Math.floor(Math.random() * rowCount);
  405 | 
  406 |     // Click the row selector for the selected row using the row index
  407 |     const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${randomIndex}"]`).first();
  408 |     await rowSelector.click();
  409 | 
  410 |     // Click the OK button to confirm selection
  411 |     await this.poNumberOkButton.click();
  412 |     await this.page.waitForLoadState('networkidle');
  413 |     console.log(`Selected PO number at random index: ${randomIndex}`);
  414 |   }
  415 | 
  416 |   async fillPrice(value: string) {
  417 |     await this.priceInput.fill(value);
  418 |     await this.page.waitForLoadState('networkidle');
  419 |   }
  420 | 
  421 |   async fillReference(value: string) {
  422 |     await this.referenceInput.fill(value);
  423 |     await this.page.waitForLoadState('networkidle');
  424 |   }
  425 | 
  426 |   async fillSeasonSelection(value: string) {
  427 |     await this.seasonSelectionInput.fill(value);
  428 |     await this.page.waitForLoadState('networkidle');
  429 |   }
  430 | 
  431 |   async fillStyleColor(value: string) {
  432 |     await this.styleColorInput.fill(value);
  433 |     await this.page.waitForLoadState('networkidle');
  434 |   }
  435 | 
  436 |   async fillStyleStatus(value: string) {
  437 |     await this.styleStatusInput.fill(value);
  438 |     await this.page.waitForLoadState('networkidle');
  439 |   }
  440 | 
  441 |   async scrollToAttachmentDetails() {
  442 |     await this.page.evaluate(() => window.scrollBy(0, 1000));
  443 |     await this.page.waitForTimeout(500);
  444 |   }
  445 | 
  446 |   async waitForAttachmentDetailsCreateButton() {
  447 |     await this.attachmentDetailsCreateButton.waitFor({ state: 'visible', timeout: 10000 });
  448 |   }
  449 | 
  450 |   async clickAttachmentDetailsCreateButton() {
  451 |     await this.attachmentDetailsCreateButton.click();
  452 |     await this.page.waitForLoadState('networkidle');
  453 |     await this.page.waitForTimeout(500);
  454 |   }
  455 | 
  456 |   async waitForAttachmentDetailsTableRow() {
  457 |     const firstRow = this.attachmentDetailsTable.locator('tbody tr[role="row"]').first();
  458 |     await firstRow.waitFor({ state: 'visible', timeout: 10000 });
  459 |   }
  460 | 
  461 |   async fillAttachmentDetailsRow(rowIndex: number, docName: string, remarks: string) {
  462 |     const row = this.attachmentDetailsTable.locator(`tbody tr[data-sap-ui-rowindex="1"]`).first();
  463 | 
  464 |     // Fill Doc Name field (first input in the row)
  465 |     const docNameInput = row.locator('input[id*="__input"][id*="__clone"]').first();
> 466 |     await docNameInput.click();
      |                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  467 |     await docNameInput.fill(docName);
  468 | 
  469 |     // Fill Remarks field (second input in the row)
  470 |     const remarksInput = row.locator('input[id*="__input"][id*="__clone"]').nth(1);
  471 |     await remarksInput.click();
  472 |     await remarksInput.fill(remarks);
  473 | 
  474 |     await this.page.waitForLoadState('networkidle');
  475 |   }
  476 | 
  477 |   async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string }>) {
  478 |     for (let i = 0; i < attachmentDetails.length; i++) {
  479 |       // Click Create button to add a new row
  480 |       await this.clickAttachmentDetailsCreateButton();
  481 |       await this.waitForAttachmentDetailsTableRow();
  482 | 
  483 |       // Fill the row data
  484 |       const rowIndex = i;
  485 |       await this.fillAttachmentDetailsRow(rowIndex, attachmentDetails[i].docName, attachmentDetails[i].remarks);
  486 |     }
  487 |   }
  488 | }
  489 | 
```