# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 54. Fill Attachment Details section
- Location: e2e\apparel_regression_testing.spec.ts:860:7

# Error details

```
TimeoutError: page.waitForEvent: Timeout 30000ms exceeded while waiting for event "filechooser"
=========================== logs ===========================
waiting for event "filechooser"
============================================================
```

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('div[id*="AttachmentDetails::LineItem-innerTable-tableCtrlCnt"]').locator('button[id*="fu_button"]').last()
    - locator resolved to <button title="Upload file" data-sap-ui-render="" data-ui5-accesskey="" aria-label="Upload file" class="sapMBtnBase sapMBtn" id="__uploader0-__clone81-__clone195-fu_button" data-sap-ui="__uploader0-__clone81-__clone195-fu_button" aria-describedby="__uploader0-__clone81-__clone195-AccDescr">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    56 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
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
  452 |     await this.attachmentDetailsCreateButton.click();
  453 |     await this.page.waitForLoadState('networkidle');
  454 |     await this.page.waitForTimeout(500);
  455 |   }
  456 | 
  457 |   async waitForAttachmentDetailsTableRow() {
  458 |     const firstRow = this.attachmentDetailsTable.locator('tbody tr[role="row"]').first();
  459 |     await firstRow.waitFor({ state: 'visible', timeout: 10000 });
  460 |   }
  461 | 
  462 |   async fillAttachmentDetailsRow(rowIndex: number, docName: string, remarks: string, filePath?: string) {
  463 | 
  464 |     // Fill Doc Name field (first input in the row)
  465 |     const docNameInput = this.page.locator('input[id*="__input"][id*="__clone"]').first();
  466 |     await docNameInput.click();
  467 |     await docNameInput.fill(docName);
  468 | 
  469 |     // Fill Remarks field (second input in the row)
  470 |     const remarksInput = this.page.locator('input[id*="__input"][id*="__clone"]').nth(1);
  471 |     await remarksInput.click();
  472 |     await remarksInput.fill(remarks);
  473 | 
  474 |     // Upload file if provided
  475 |     if (filePath) {
  476 |       await this.uploadAttachmentFile(filePath);
  477 |     }
  478 | 
  479 |     await this.page.waitForLoadState('networkidle');
  480 |   }
  481 | 
  482 |   async uploadAttachmentFile(filePath: string) {
  483 |     // Resolve the file path relative to the project root (go up 3 levels from src/pages/StyleMaster/)
  484 |     const absolutePath = path.resolve(__dirname, '../../../', filePath);
  485 |     console.log(`Uploading file from path: ${filePath}`);
  486 |     console.log(`Resolved absolute path: ${absolutePath}`);
  487 | 
  488 |     // Set up file chooser listener before clicking the upload button
  489 |     const fileChooserPromise = this.page.waitForEvent('filechooser');
  490 | 
  491 |     // Click the upload button to open file explorer
  492 |     const uploadButton = this.attachmentDetailsTable.locator('button[id*="fu_button"]').last();
> 493 |     await uploadButton.click();
      |                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  494 |     console.log('Upload button clicked, waiting for file chooser...');
  495 | 
  496 |     // Wait for file chooser and select the file
  497 |     const fileChooser = await fileChooserPromise;
  498 |     await fileChooser.setFiles(absolutePath);
  499 |     console.log(`File selected: ${absolutePath}`);
  500 | 
  501 |     // Wait for upload to process
  502 |     await this.page.waitForTimeout(3000);
  503 |     await this.page.waitForLoadState('networkidle');
  504 |     console.log(`File uploaded successfully: ${filePath}`);
  505 |   }
  506 | 
  507 |   async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string; filePath?: string }>) {
  508 |     for (let i = 0; i < attachmentDetails.length; i++) {
  509 |       // Click Create button to add a new row
  510 |       await this.clickAttachmentDetailsCreateButton();
  511 |       await this.waitForAttachmentDetailsTableRow();
  512 | 
  513 |       // Fill the row data
  514 |       const rowIndex = i;
  515 |       await this.fillAttachmentDetailsRow(
  516 |         rowIndex,
  517 |         attachmentDetails[i].docName,
  518 |         attachmentDetails[i].remarks,
  519 |         attachmentDetails[i].filePath
  520 |       );
  521 |     }
  522 |   }
  523 | }
  524 | 
```