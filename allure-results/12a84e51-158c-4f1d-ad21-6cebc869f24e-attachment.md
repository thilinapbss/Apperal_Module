# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53b. Fill Segment Data (Color, Size, Season)
- Location: e2e\apparel_regression_testing.spec.ts:865:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button[id*="table::Segment1::LineItem::StandardAction::Create"]') to be visible

```

# Test source

```ts
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
  458 |     // Wait for a new row to be added to the table
  459 |     const rows = this.attachmentDetailsTable.locator('tbody tr[role="row"]:not([class*="sapUiTableRowHidden"])');
  460 |     await rows.first().waitFor({ state: 'visible', timeout: 10000 });
  461 |     await this.page.waitForTimeout(1500);
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
  477 |     // if (filePath) {
  478 |     //   await this.uploadAttachmentFile(filePath);
  479 |     //   await this.page.waitForTimeout(1500);
  480 | 
  481 |     //   // Click the Generate button
  482 |     //   await this.page.locator('button[id*="RefreshSemiFinishGoods"]').click();
  483 |     //   await this.page.waitForLoadState('networkidle');
  484 |     // }
  485 | 
  486 |     await this.page.waitForLoadState('networkidle');
  487 |   }
  488 | 
  489 |   // async uploadAttachmentFile(filePath: string) {
  490 |   //   // Resolve the file path relative to the project root (go up 3 levels from src/pages/StyleMaster/)
  491 |   //   const absolutePath = path.resolve(__dirname, '../../../', filePath);
  492 |   //   console.log(`Uploading file from path: ${filePath}`);
  493 |   //   console.log(`Resolved absolute path: ${absolutePath}`);
  494 | 
  495 |   //   // Get all file inputs in the attachment details table
  496 |   //   const fileInputs = this.attachmentDetailsTable.locator('input[type="file"][name="FEV4FileUpload"]');
  497 |   //   const fileInputCount = await fileInputs.count();
  498 |   //   console.log(`Found ${fileInputCount} file input(s) in the table`);
  499 | 
  500 |   //   // Use the last file input (most recently added row)
  501 |   //   const lastFileInput = fileInputs.last();
  502 | 
  503 |   //   // Wait for the file input to be attached to the DOM
  504 |   //   await lastFileInput.waitFor({ state: 'attached', timeout: 10000 });
  505 |   //   console.log('File input found and attached to DOM');
  506 | 
  507 |   //   // Set the file directly on the input element
  508 |   //   await lastFileInput.setInputFiles(absolutePath);
  509 |   //   console.log(`File set: ${absolutePath}`);
  510 | 
  511 |   //   // Wait for upload to process
  512 |   //   await this.page.waitForTimeout(3000);
  513 |   //   await this.page.waitForLoadState('networkidle');
  514 |   //   console.log(`File uploaded successfully: ${filePath}`);
  515 |   // }
  516 | 
  517 |   async addAttachmentDetailsRows(attachmentDetails: Array<{ docName: string; remarks: string; filePath?: string }>) {
  518 |     for (let i = 0; i < attachmentDetails.length; i++) {
  519 |       // Click Create button to add a new row
  520 |       await this.clickAttachmentDetailsCreateButton();
  521 |       await this.waitForAttachmentDetailsTableRow();
  522 | 
  523 |       // Fill the row data
  524 |       const rowIndex = i;
  525 |       await this.fillAttachmentDetailsRow(
  526 |         rowIndex,
  527 |         attachmentDetails[i].docName,
  528 |         attachmentDetails[i].remarks,
  529 |         attachmentDetails[i].filePath
  530 |       );
  531 |     }
  532 |   }
  533 | 
  534 |   // Segment Data Entry Methods
  535 |   async getSegmentCreateButton(segmentType: string) {
  536 |     return this.page.locator(`button[id*="table::${segmentType}::LineItem::StandardAction::Create"]`);
  537 |   }
  538 | 
  539 |   async clickSegmentCreateButton(segmentType: string) {
  540 |     const createButton = await this.getSegmentCreateButton(segmentType);
> 541 |     await createButton.waitFor({ state: 'visible', timeout: 10000 });
      |                        ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  542 |     await createButton.click();
  543 |     await this.page.waitForLoadState('networkidle');
  544 |     await this.page.waitForTimeout(1000);
  545 |   }
  546 | 
  547 |   async fillSegmentValueInFirstRow(segmentType: string, codeValue: string, nameValue: string) {
  548 |     // Get the first row of the segment table
  549 |     const segmentTableBody = this.page.locator(`tbody[id*="${segmentType}::LineItem"][id*="tblBody"]`);
  550 |     await segmentTableBody.waitFor({ state: 'attached', timeout: 10000 });
  551 | 
  552 |     // Get the first row
  553 |     const firstRow = segmentTableBody.locator('tr[role="row"]').first();
  554 |     await firstRow.waitFor({ state: 'attached', timeout: 10000 });
  555 | 
  556 |     // Get input fields in the first row
  557 |     const inputs = firstRow.locator('input[type="text"]');
  558 |     const inputCount = await inputs.count();
  559 | 
  560 |     if (inputCount >= 2) {
  561 |       // Fill CodeNo (first input)
  562 |       await inputs.nth(0).click();
  563 |       await inputs.nth(0).fill(codeValue);
  564 |       await this.page.keyboard.press('Tab');
  565 | 
  566 |       // Fill Name (second input)
  567 |       await inputs.nth(1).click();
  568 |       await inputs.nth(1).fill(nameValue);
  569 |       await this.page.keyboard.press('Tab');
  570 | 
  571 |       await this.page.waitForLoadState('networkidle');
  572 |     }
  573 |   }
  574 | 
  575 |   async fillSegmentValuesForSection(
  576 |     segmentType: string,
  577 |     values: Array<{ code: string; name: string }>
  578 |   ) {
  579 |     console.log(`\nFilling ${segmentType} segment values...`);
  580 | 
  581 |     for (let i = 0; i < values.length; i++) {
  582 |       // Click Create button to add a new row
  583 |       await this.clickSegmentCreateButton(segmentType);
  584 |       console.log(`  Created row ${i + 1} for ${segmentType}`);
  585 | 
  586 |       // Wait a moment for the row to be created
  587 |       await this.page.waitForTimeout(500);
  588 | 
  589 |       // Fill the segment value in the first row
  590 |       await this.fillSegmentValueInFirstRow(segmentType, values[i].code, values[i].name);
  591 |       console.log(`  Filled: Code=${values[i].code}, Name=${values[i].name}`);
  592 |     }
  593 | 
  594 |     console.log(`✓ Completed filling ${segmentType} values`);
  595 |   }
  596 | 
  597 |   async fillAllSegmentData(segmentsData: {
  598 |     Color?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  599 |     Size?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  600 |     Season?: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }>;
  601 |   }) {
  602 |     const segmentMap: { [key: string]: string } = {
  603 |       Color: 'Segment1',
  604 |       Size: 'Segment2',
  605 |       Season: 'Segment3'
  606 |     };
  607 | 
  608 |     for (const [segmentType, data] of Object.entries(segmentsData)) {
  609 |       if (data && Array.isArray(data) && data.length > 0) {
  610 |         const uiSegmentType = segmentMap[segmentType] || segmentType;
  611 |         const values = data[0].values;
  612 | 
  613 |         if (values && values.length > 0) {
  614 |           await this.fillSegmentValuesForSection(uiSegmentType, values);
  615 |         }
  616 |       }
  617 |     }
  618 |   }
  619 | }
  620 | 
```