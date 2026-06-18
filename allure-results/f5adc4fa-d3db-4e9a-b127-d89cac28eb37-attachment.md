# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1163:7

# Error details

```
Error: Finish Goods section not found on the page
```

# Test source

```ts
  1282 |         if (finishGoodsSection) {
  1283 |           finishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1284 |         }
  1285 |       });
  1286 |       await this.page.waitForTimeout(1000);
  1287 | 
  1288 |       // Find and click the Generate button
  1289 |       const generateButton = this.page.locator(
  1290 |         'button[id*="FinishGoods::CustomAction::RefreshFinishGoods"]'
  1291 |       );
  1292 | 
  1293 |       const count = await generateButton.count();
  1294 |       if (count === 0) {
  1295 |         throw new Error('Finish Goods Generate button not found');
  1296 |       }
  1297 | 
  1298 |       console.log('  ✓ Generate button found');
  1299 |       await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  1300 |       console.log('  ✓ Generate button is visible');
  1301 | 
  1302 |       await generateButton.click();
  1303 |       console.log('  ✓ Generate button clicked');
  1304 | 
  1305 |       // Wait for the generation process
  1306 |       await this.page.waitForLoadState('networkidle');
  1307 |       await this.page.waitForTimeout(1000);
  1308 | 
  1309 |       console.log('\n║ ✓ Finish Goods data generated successfully');
  1310 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1311 | 
  1312 |       return true;
  1313 |     } catch (e) {
  1314 |       console.error('\n✗ Failed to click Finish Goods Generate button:');
  1315 |       console.error(e);
  1316 |       throw e;
  1317 |     }
  1318 |   }
  1319 | 
  1320 |   async verifyFinishGoodsCombinations(
  1321 |     segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
  1322 |     routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  1323 |   ) {
  1324 |     try {
  1325 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1326 |       console.log('║        VERIFYING FINISH GOODS COMBINATIONS                 ║');
  1327 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1328 | 
  1329 |       // Extract segment values
  1330 |       const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
  1331 |       for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
  1332 |         if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  1333 |           segmentValues[segmentType] = segmentData[0].values || [];
  1334 |         }
  1335 |       }
  1336 | 
  1337 |       console.log('📋 Segment Values:');
  1338 |       for (const [segmentType, values] of Object.entries(segmentValues)) {
  1339 |         console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
  1340 |       }
  1341 | 
  1342 |       // Filter routes: only use Finish Goods routes
  1343 |       const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
  1344 |       const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
  1345 | 
  1346 |       console.log('\n📋 Routing Routes:');
  1347 |       if (finishGoodsRoutes.length > 0) {
  1348 |         console.log('  Finish Goods Routes:');
  1349 |         finishGoodsRoutes.forEach(route => {
  1350 |           console.log(`    ${route.routeCode}: ${route.routeName}`);
  1351 |         });
  1352 |       }
  1353 |       console.log('  Semi-Finish Goods Routes (excluded):');
  1354 |       semiFinishGoodsRoutes.forEach(route => {
  1355 |         console.log(`    ${route.routeCode}: ${route.routeName}`);
  1356 |       });
  1357 | 
  1358 |       // Calculate expected count (count of size values)
  1359 |       const sizeValues = segmentValues['Size'] || [];
  1360 |       const expectedCount = sizeValues.length;
  1361 | 
  1362 |       console.log(`\n📊 Expected Row Count: ${expectedCount}`);
  1363 |       console.log(`  Expected items: ${sizeValues.map(s => `${s.code}(${s.name})`).join(', ')}`);
  1364 | 
  1365 |       // Count non-empty rows in Finish Goods section using XPath
  1366 |       console.log(`\n📊 Counting non-empty rows in Finish Goods section...`);
  1367 | 
  1368 |       // Scroll to Finish Goods section
  1369 |       await this.page.evaluate(() => {
  1370 |         const finishGoodsElement = document.querySelector('[id*="FinishGoods"]');
  1371 |         if (finishGoodsElement) {
  1372 |           finishGoodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1373 |         }
  1374 |       });
  1375 |       await this.page.waitForTimeout(1000);
  1376 | 
  1377 |       // Find the Finish Goods section using a more robust selector
  1378 |       const finishGoodsSection = this.page.locator('section[id*="FinishGoods"]');
  1379 |       const sectionCount = await finishGoodsSection.count();
  1380 | 
  1381 |       if (sectionCount === 0) {
> 1382 |         throw new Error('Finish Goods section not found on the page');
       |               ^ Error: Finish Goods section not found on the page
  1383 |       }
  1384 | 
  1385 |       // Find all rows in the section that have data (input with non-empty value)
  1386 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
  1387 |       const actualRowCount = await dataRows.count();
  1388 | 
  1389 |       console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
  1390 |       console.log(`\n📊 Actual Rows: ${actualRowCount}`);
  1391 |       console.log(`\n🔍 Verification Results:`);
  1392 |       console.log(`  ✓ Expected: ${expectedCount}`);
  1393 |       console.log(`  ✓ Found: ${actualRowCount}`);
  1394 | 
  1395 |       const allFound = actualRowCount === expectedCount;
  1396 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1397 | 
  1398 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1399 |       if (allFound) {
  1400 |         console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
  1401 |       } else {
  1402 |         console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
  1403 |       }
  1404 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1405 | 
  1406 |       return {
  1407 |         allFound,
  1408 |         expectedCount,
  1409 |         actualCount: actualRowCount,
  1410 |         foundCount: actualRowCount,
  1411 |         missingCount: Math.max(0, expectedCount - actualRowCount),
  1412 |         missingCombinations: []
  1413 |       };
  1414 |     } catch (e) {
  1415 |       console.error('\n✗ Failed to verify Finish Goods combinations:');
  1416 |       console.error(e);
  1417 |       throw e;
  1418 |     }
  1419 |   }
  1420 | 
  1421 |   async selectBuyerPOItemsForFinishGoods() {
  1422 |     try {
  1423 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1424 |       console.log('║         FILLING BUYER PO ITEMS FOR FINISH GOODS             ║');
  1425 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1426 | 
  1427 |       // Find the Finish Goods table
  1428 |       const finishGoodsTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');
  1429 | 
  1430 |       // Get the actual data tbody (skip header clones)
  1431 |       const dataTableBody = finishGoodsTable.locator('tbody').last();
  1432 | 
  1433 |       // Get all data rows
  1434 |       const allRows = dataTableBody.locator('tr[role="row"]');
  1435 |       const totalTableRows = await allRows.count();
  1436 | 
  1437 |       // First pass: Count only non-empty rows
  1438 |       let nonEmptyRowCount = 0;
  1439 |       for (let i = 0; i < totalTableRows; i++) {
  1440 |         const row = allRows.nth(i);
  1441 |         const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1442 |         const itemCodeInput = itemCodeCell.locator('input').first();
  1443 |         const itemCode = await itemCodeInput.inputValue();
  1444 |         if (itemCode && itemCode.trim() !== '') {
  1445 |           nonEmptyRowCount++;
  1446 |         }
  1447 |       }
  1448 | 
  1449 |       const totalRows = nonEmptyRowCount;
  1450 |       console.log(`📋 Found ${totalRows} rows with data (${totalTableRows} total rows in table)\n`);
  1451 | 
  1452 |       let successCount = 0;
  1453 | 
  1454 |       // Loop through each row
  1455 |       for (let i = 0; i < totalTableRows; i++) {
  1456 |         try {
  1457 |           // Get fresh row reference for each iteration
  1458 |           const freshAllRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody').last().locator('tr[role="row"]');
  1459 |           const currentRow = freshAllRows.nth(i);
  1460 | 
  1461 |           // Get ItemCode value from first column
  1462 |           const itemCodeCell = currentRow.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1463 |           const itemCodeInput = itemCodeCell.locator('input').first();
  1464 |           const itemCode = await itemCodeInput.inputValue();
  1465 | 
  1466 |           // Skip empty rows
  1467 |           if (!itemCode || itemCode.trim() === '') {
  1468 |             console.log(`  Row ${i + 1}: ⊘ Skipped (empty)`);
  1469 |             continue;
  1470 |           }
  1471 | 
  1472 |           console.log(`  ╔═══════════════════════════════════════════════════════╗`);
  1473 |           console.log(`  ║ Row ${i + 1} - ItemCode: ${itemCode.toUpperCase()}`);
  1474 |           console.log(`  ╚═══════════════════════════════════════════════════════╝`);
  1475 | 
  1476 |           // Calculate price: 1500 for first row, then add 500 for each subsequent row
  1477 |           // Row 1: 1500, Row 2: 2000, Row 3: 2500, etc.
  1478 |           const basePrice = 1500;
  1479 |           const incrementPerRow = 500;
  1480 |           let rowCountForPricing = 0;
  1481 | 
  1482 |           // Count non-empty rows up to current row to get accurate row number
```