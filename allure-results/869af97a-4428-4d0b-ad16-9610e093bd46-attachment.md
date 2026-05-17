# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 29c. Save Segment Master record
- Location: e2e/apparel_regression_testing.spec.ts:407:7

# Error details

```
TypeError: Cannot read properties of undefined (reading 'clickSaveButton')
```

# Test source

```ts
  308 | 
  309 |   test('22b. Capture all entered form data and save to buyerPO.json', async () => {
  310 |     const formData = await buyerPoUploadFormPage.captureAllFormData();
  311 |     console.log('Captured form data:', JSON.stringify(formData, null, 2));
  312 | 
  313 |     const outputPath = path.join(__dirname, '../testData/Buyer_PO_Upload/buyerPO.json');
  314 |     fs.writeFileSync(outputPath, JSON.stringify(formData, null, 2));
  315 |     console.log(`Form data saved to ${outputPath}`);
  316 |   });
  317 | 
  318 |   test('23. Click Save/Create button to save the form', async () => {
  319 |     await buyerPoUploadFormPage.clickSaveCreateButton();
  320 |   });
  321 | 
  322 |   test('24. Capture all line item details and update test data JSON', async () => {
  323 |     const capturedLineItems = await buyerPoUploadFormPage.captureLineItemsWithAllDetails();
  324 |     console.log('Captured Line Items:', JSON.stringify(capturedLineItems, null, 2));
  325 | 
  326 |     const validItems = capturedLineItems.filter((item: any) => item.partNo && item.deliveryNo);
  327 |     expect(validItems.length).toBeGreaterThan(0);
  328 |     console.log(`Captured ${validItems.length} line items with complete data`);
  329 | 
  330 |     testData.testScenarios[0].lineItems = validItems.map((item: any) => ({
  331 |       poNo: item.poNo,
  332 |       countryCode: item.countryCode,
  333 |       partNo: item.partNo,
  334 |       qty: item.qty,
  335 |       deliveryDate: item.deliveryDate,
  336 |       pcdDate: item.pcdDate,
  337 |       fobDate: item.fobDate,
  338 |       deliveryNo: item.deliveryNo,
  339 |     }));
  340 | 
  341 |     const updatedTestDataPath = path.join(__dirname, '../testData/Buyer_PO_Upload/test-data.json');
  342 |     fs.writeFileSync(updatedTestDataPath, JSON.stringify(testData, null, 2));
  343 |     console.log('Test data JSON updated with actual delivery numbers and values');
  344 |   });
  345 | 
  346 |   test('25. Verify saved record appears in the Buyer PO Upload list', async () => {
  347 |     await buyerPoUploadFormPage.navigateBackToList();
  348 | 
  349 |     const buyerPOPath = path.join(__dirname, '../testData/Buyer_PO_Upload/buyerPO.json');
  350 |     const buyerPOData = JSON.parse(fs.readFileSync(buyerPOPath, 'utf-8'));
  351 | 
  352 |     const supplierCode = buyerPOData.header.supplierCode;
  353 |     const styleNo = buyerPOData.header.styleNo;
  354 |     const season = buyerPOData.header.season;
  355 | 
  356 |     console.log('Verifying record with:', { supplierCode, styleNo, season });
  357 | 
  358 |     const result = await buyerPoUploadFormPage.verifyRecordInListTable({ supplierCode, styleNo, season });
  359 | 
  360 |     console.log(`Total rows in list: ${result.totalRows}`);
  361 |     console.log(`Matching rows: ${result.matchCount}`);
  362 |     expect(result.found).toBe(true);
  363 |   });
  364 | 
  365 |   test('26. Navigate to home page and verify tile content', async () => {
  366 |     await sharedPage.goto('/');
  367 |     await homePage.waitForDashboard();
  368 | 
  369 |     await expect(homePage.groupHeader(homePage.merchandisingGroup)).toHaveText('Merchandising Process');
  370 |     await expect(homePage.groupHeader(homePage.productionGroup)).toHaveText('Production Process');
  371 |     await expect(homePage.groupHeader(homePage.otherGroup)).toHaveText('Other');
  372 |     await expect(homePage.groupHeader(homePage.mastersGroup)).toHaveText('Masters & Sub Masters');
  373 | 
  374 |     await expect(homePage.tile(homePage.merchandisingGroup, 'Buyer PO Upload')).toBeVisible();
  375 |     await expect(homePage.tile(homePage.mastersGroup, 'Segment Master')).toBeVisible();
  376 |   });
  377 | 
  378 |   test('27. Click on Segment Master tile and verify navigation', async () => {
  379 |     const segmentMasterTile = homePage.tile(homePage.mastersGroup, 'Segment Master');
  380 |     await expect(segmentMasterTile).toBeVisible();
  381 |     await segmentMasterTile.click();
  382 |     await sharedPage.waitForLoadState('networkidle');
  383 |     await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
  384 |   });
  385 | 
  386 |   test('28. Click Create button on Segment Master list', async () => {
  387 |     segmentMasterPage = new SegmentMasterPage(sharedPage);
  388 |     await expect(segmentMasterPage.listCreateButton).toBeVisible({ timeout: 30000 });
  389 |     await segmentMasterPage.clickCreateButton();
  390 |   });
  391 | 
  392 |   test('29. Enter name in Segment Master Create form', async () => {
  393 |     segmentMasterCreatePage = new SegmentMasterCreate(sharedPage);
  394 |     await segmentMasterCreatePage.waitForFormLoad();
  395 |     await segmentMasterCreatePage.fillName(segmentMasterData.name);
  396 |     const entered = await segmentMasterCreatePage.nameInput.inputValue();
  397 |     expect(entered).toBe(segmentMasterData.name);
  398 |     console.log(`Segment Master name entered: ${entered}`);
  399 |   });
  400 | 
  401 |   test('29b. Add all segment line items', async () => {
  402 |     await expect(segmentMasterCreatePage.lineItemCreateButton).toBeVisible({ timeout: 10000 });
  403 |     await segmentMasterCreatePage.fillAllLineItemRows(segmentMasterData.segments);
  404 |     console.log(`Filled ${segmentMasterData.segments.length} segment line item(s)`);
  405 |   });
  406 | 
  407 |   test('29c. Save Segment Master record', async () => {
> 408 |     await segmentMasterCreatePage.clickSaveButton();
      |                                   ^ TypeError: Cannot read properties of undefined (reading 'clickSaveButton')
  409 |     await expect(sharedPage).toHaveURL(/apperalsegmentmaster/);
  410 |   });
  411 | });
  412 | 
```