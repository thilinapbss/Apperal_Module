# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 54. Fill Attachment Details section
- Location: e2e\apparel_regression_testing.spec.ts:860:7

# Error details

```
Error: ENOENT: no such file or directory, stat 'C:\Users\thilina\OneDrive - Perfect Business Solutions Services (Pvt) Ltd\Desktop\Apperal_Module\src\testData\StyleMaster\UploadFiles\PDF_Upload.pdf'
```

# Test source

```ts
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
  483 |     // Resolve the file path relative to the project root
  484 |     const absolutePath = path.resolve(__dirname, '../../', filePath);
  485 |     console.log(`Uploading file: ${absolutePath}`);
  486 | 
  487 |     // Find the file input in the attachment details table (most recently added row)
  488 |     const fileInput = this.attachmentDetailsTable.locator('input[type="file"][name="FEV4FileUpload"]').last();
  489 | 
  490 |     // Wait for the file input to be available
  491 |     await fileInput.waitFor({ state: 'attached', timeout: 10000 });
  492 | 
  493 |     // Set the file
> 494 |     await fileInput.setInputFiles(absolutePath);
      |     ^ Error: ENOENT: no such file or directory, stat 'C:\Users\thilina\OneDrive - Perfect Business Solutions Services (Pvt) Ltd\Desktop\Apperal_Module\src\testData\StyleMaster\UploadFiles\PDF_Upload.pdf'
  495 | 
  496 |     // Wait for upload to process
  497 |     await this.page.waitForTimeout(3000);
  498 |     await this.page.waitForLoadState('networkidle');
  499 |     console.log(`File uploaded successfully: ${filePath}`);
  500 |   }
  501 | 
  502 |   async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string; filePath?: string }>) {
  503 |     for (let i = 0; i < attachmentDetails.length; i++) {
  504 |       // Click Create button to add a new row
  505 |       await this.clickAttachmentDetailsCreateButton();
  506 |       await this.waitForAttachmentDetailsTableRow();
  507 | 
  508 |       // Fill the row data
  509 |       const rowIndex = i;
  510 |       await this.fillAttachmentDetailsRow(
  511 |         rowIndex,
  512 |         attachmentDetails[i].docName,
  513 |         attachmentDetails[i].remarks,
  514 |         attachmentDetails[i].filePath
  515 |       );
  516 |     }
  517 |   }
  518 | }
  519 | 
```