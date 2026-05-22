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
  - waiting for locator('button[id*="AttachmentDetails::LineItem::StandardAction::Create"]')
    - locator resolved to <button data-sap-ui-render="" data-ui5-accesskey="c" aria-describedby="__text207" aria-keyshortcuts="Ctrl+Enter" class="sapMBtnBase sapMBtn sapMBarChild" id="apperal.stylemaster::StyleMasterObjectPage--fe::table::AttachmentDetails::LineItem::StandardAction::Create" data-sap-ui="apperal.stylemaster::StyleMasterObjectPage--fe::table::AttachmentDetails::LineItem::StandardAction::Create">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    25 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div tabindex="0" class="sapUiBLy" id="sap-ui-blocklayer-popup"></div> from <div id="sap-ui-static" data-sap-ui-area="sap-ui-static">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

```

# Test source

```ts
  352 | 
  353 |     await this.page.waitForLoadState('networkidle');
  354 |   }
  355 | 
  356 |   async clickPONumberValueHelp() {
  357 |     // Try to close any open overlays first
  358 |     try {
  359 |       await this.page.locator('[class*="sapUiBLy"]').click({ force: true, timeout: 1000 });
  360 |     } catch {
  361 |       // Overlay doesn't exist, continue
  362 |     }
  363 | 
  364 |     await this.poNumberValueHelpButton.click({ force: true });
  365 |     await this.page.waitForLoadState('networkidle');
  366 |   }
  367 | 
  368 |   async waitForPONumberDialogLoad() {
  369 |     await this.poNumberDialog.waitFor({ state: 'attached', timeout: 10000 });
  370 |     await this.page.waitForTimeout(500);
  371 |   }
  372 | 
  373 |   async selectPONumberByValue(poValue: string) {
  374 |     // Find the row index containing the PO number value
  375 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  376 |     const rowIndex = await allRows.filter({ hasText: poValue }).first().evaluate(el => {
  377 |       return el.getAttribute('data-sap-ui-rowindex');
  378 |     });
  379 | 
  380 |     // Click the row selector for this row
  381 |     const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${rowIndex}"]`);
  382 |     await rowSelector.click();
  383 |     await this.poNumberOkButton.click();
  384 |     await this.page.waitForLoadState('networkidle');
  385 |   }
  386 | 
  387 |   async selectFirstPONumber() {
  388 |     // Click the first row's selector
  389 |     const firstRowSelector = this.page.locator('[id*="Table-innerTable-rowsel0"]').first();
  390 |     await firstRowSelector.click();
  391 |     await this.poNumberOkButton.click();
  392 |     await this.page.waitForLoadState('networkidle');
  393 |   }
  394 | 
  395 |   async selectRandomPONumber() {
  396 |     // Get all PO number rows from the table
  397 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  398 |     const rowCount = await allRows.count();
  399 | 
  400 |     if (rowCount === 0) {
  401 |       throw new Error('No PO number rows found in the table');
  402 |     }
  403 | 
  404 |     // Select a random row (0 to rowCount-1)
  405 |     const randomIndex = Math.floor(Math.random() * rowCount);
  406 | 
  407 |     // Click the row selector for the selected row using the row index
  408 |     const rowSelector = this.page.locator(`[id*="Table-innerTable-rowsel${randomIndex}"]`).first();
  409 |     await rowSelector.click();
  410 | 
  411 |     // Click the OK button to confirm selection
  412 |     await this.poNumberOkButton.click();
  413 |     await this.page.waitForLoadState('networkidle');
  414 |     console.log(`Selected PO number at random index: ${randomIndex}`);
  415 |   }
  416 | 
  417 |   async fillPrice(value: string) {
  418 |     await this.priceInput.fill(value);
  419 |     await this.page.waitForLoadState('networkidle');
  420 |   }
  421 | 
  422 |   async fillReference(value: string) {
  423 |     await this.referenceInput.fill(value);
  424 |     await this.page.waitForLoadState('networkidle');
  425 |   }
  426 | 
  427 |   async fillSeasonSelection(value: string) {
  428 |     await this.seasonSelectionInput.fill(value);
  429 |     await this.page.waitForLoadState('networkidle');
  430 |   }
  431 | 
  432 |   async fillStyleColor(value: string) {
  433 |     await this.styleColorInput.fill(value);
  434 |     await this.page.waitForLoadState('networkidle');
  435 |   }
  436 | 
  437 |   async fillStyleStatus(value: string) {
  438 |     await this.styleStatusInput.fill(value);
  439 |     await this.page.waitForLoadState('networkidle');
  440 |   }
  441 | 
  442 |   async scrollToAttachmentDetails() {
  443 |     await this.page.evaluate(() => window.scrollBy(0, 1000));
  444 |     await this.page.waitForTimeout(500);
  445 |   }
  446 | 
  447 |   async waitForAttachmentDetailsCreateButton() {
  448 |     await this.attachmentDetailsCreateButton.waitFor({ state: 'visible', timeout: 10000 });
  449 |   }
  450 | 
  451 |   async clickAttachmentDetailsCreateButton() {
> 452 |     await this.attachmentDetailsCreateButton.click();
      |                                              ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  453 |     await this.page.waitForLoadState('networkidle');
  454 |     await this.page.waitForTimeout(500);
  455 |   }
  456 | 
  457 |   async waitForAttachmentDetailsTableRow() {
  458 |     // Wait for a new row to be added to the table
  459 |     const rows = this.attachmentDetailsTable.locator('tbody tr[role="row"]:not([class*="sapUiTableRowHidden"])');
  460 |     await rows.first().waitFor({ state: 'visible', timeout: 10000 });
  461 |     await this.page.waitForTimeout(500);
  462 |   }
  463 | 
  464 |   async fillAttachmentDetailsRow(rowIndex: number, docName: string, remarks: string, filePath?: string) {
  465 | 
  466 |     // Fill Doc Name field (first input in the row)
  467 |     const docNameInput = this.page.locator('input[id*="__input"][id*="__clone"]').first();
  468 |     await docNameInput.click();
  469 |     await docNameInput.fill(docName);
  470 | 
  471 |     // Fill Remarks field (second input in the row)
  472 |     const remarksInput = this.page.locator('input[id*="__input"][id*="__clone"]').nth(1);
  473 |     await remarksInput.click();
  474 |     await remarksInput.fill(remarks);
  475 | 
  476 |     // Upload file if provided
  477 |     if (filePath) {
  478 |       await this.uploadAttachmentFile(filePath);
  479 |       await this.page.waitForTimeout(1500);
  480 | 
  481 |     }
  482 | 
  483 |     await this.page.waitForLoadState('networkidle');
  484 |   }
  485 | 
  486 |   async uploadAttachmentFile(filePath: string) {
  487 |     // Resolve the file path relative to the project root (go up 3 levels from src/pages/StyleMaster/)
  488 |     const absolutePath = path.resolve(__dirname, '../../../', filePath);
  489 |     console.log(`Uploading file from path: ${filePath}`);
  490 |     console.log(`Resolved absolute path: ${absolutePath}`);
  491 | 
  492 |     // Get all file inputs in the attachment details table
  493 |     const fileInputs = this.attachmentDetailsTable.locator('input[type="file"][name="FEV4FileUpload"]');
  494 |     const fileInputCount = await fileInputs.count();
  495 |     console.log(`Found ${fileInputCount} file input(s) in the table`);
  496 | 
  497 |     // Use the last file input (most recently added row)
  498 |     const lastFileInput = fileInputs.last();
  499 | 
  500 |     // Wait for the file input to be attached to the DOM
  501 |     await lastFileInput.waitFor({ state: 'attached', timeout: 10000 });
  502 |     console.log('File input found and attached to DOM');
  503 | 
  504 |     // Set the file directly on the input element
  505 |     await lastFileInput.setInputFiles(absolutePath);
  506 |     console.log(`File set: ${absolutePath}`);
  507 | 
  508 |     // Wait for upload to process
  509 |     await this.page.waitForTimeout(3000);
  510 |     await this.page.waitForLoadState('networkidle');
  511 |     console.log(`File uploaded successfully: ${filePath}`);
  512 |   }
  513 | 
  514 |   async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string; filePath?: string }>) {
  515 |     for (let i = 0; i < attachmentDetails.length; i++) {
  516 |       // Click Create button to add a new row
  517 |       await this.clickAttachmentDetailsCreateButton();
  518 |       await this.waitForAttachmentDetailsTableRow();
  519 | 
  520 |       // Fill the row data
  521 |       const rowIndex = i;
  522 |       await this.fillAttachmentDetailsRow(
  523 |         rowIndex,
  524 |         attachmentDetails[i].docName,
  525 |         attachmentDetails[i].remarks,
  526 |         attachmentDetails[i].filePath
  527 |       );
  528 |     }
  529 |   }
  530 | }
  531 | 
```