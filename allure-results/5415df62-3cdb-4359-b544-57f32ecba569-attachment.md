# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
Error: Finish Goods section not found on the page
```

# Test source

```ts
  1261 |         if (finishGoodsSection) {
  1262 |           finishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1263 |         }
  1264 |       });
  1265 |       await this.page.waitForTimeout(1000);
  1266 | 
  1267 |       // Find and click the Generate button
  1268 |       const generateButton = this.page.locator(
  1269 |         'button[id*="FinishGoods::CustomAction::RefreshFinishGoods"]'
  1270 |       );
  1271 | 
  1272 |       const count = await generateButton.count();
  1273 |       if (count === 0) {
  1274 |         throw new Error('Finish Goods Generate button not found');
  1275 |       }
  1276 | 
  1277 |       console.log('  ✓ Generate button found');
  1278 |       await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  1279 |       console.log('  ✓ Generate button is visible');
  1280 | 
  1281 |       await generateButton.click();
  1282 |       console.log('  ✓ Generate button clicked');
  1283 | 
  1284 |       // Wait for the generation process
  1285 |       await this.page.waitForLoadState('networkidle');
  1286 |       await this.page.waitForTimeout(1000);
  1287 | 
  1288 |       console.log('\n║ ✓ Finish Goods data generated successfully');
  1289 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1290 | 
  1291 |       return true;
  1292 |     } catch (e) {
  1293 |       console.error('\n✗ Failed to click Finish Goods Generate button:');
  1294 |       console.error(e);
  1295 |       throw e;
  1296 |     }
  1297 |   }
  1298 | 
  1299 |   async verifyFinishGoodsCombinations(
  1300 |     segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
  1301 |     routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  1302 |   ) {
  1303 |     try {
  1304 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1305 |       console.log('║        VERIFYING FINISH GOODS COMBINATIONS                 ║');
  1306 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1307 | 
  1308 |       // Extract segment values
  1309 |       const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
  1310 |       for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
  1311 |         if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  1312 |           segmentValues[segmentType] = segmentData[0].values || [];
  1313 |         }
  1314 |       }
  1315 | 
  1316 |       console.log('📋 Segment Values:');
  1317 |       for (const [segmentType, values] of Object.entries(segmentValues)) {
  1318 |         console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
  1319 |       }
  1320 | 
  1321 |       // Filter routes: only use Finish Goods routes
  1322 |       const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
  1323 |       const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
  1324 | 
  1325 |       console.log('\n📋 Routing Routes:');
  1326 |       if (finishGoodsRoutes.length > 0) {
  1327 |         console.log('  Finish Goods Routes:');
  1328 |         finishGoodsRoutes.forEach(route => {
  1329 |           console.log(`    ${route.routeCode}: ${route.routeName}`);
  1330 |         });
  1331 |       }
  1332 |       console.log('  Semi-Finish Goods Routes (excluded):');
  1333 |       semiFinishGoodsRoutes.forEach(route => {
  1334 |         console.log(`    ${route.routeCode}: ${route.routeName}`);
  1335 |       });
  1336 | 
  1337 |       // Calculate expected count (count of size values)
  1338 |       const sizeValues = segmentValues['Size'] || [];
  1339 |       const expectedCount = sizeValues.length;
  1340 | 
  1341 |       console.log(`\n📊 Expected Row Count: ${expectedCount}`);
  1342 |       console.log(`  Expected items: ${sizeValues.map(s => `${s.code}(${s.name})`).join(', ')}`);
  1343 | 
  1344 |       // Count non-empty rows in Finish Goods section using XPath
  1345 |       console.log(`\n📊 Counting non-empty rows in Finish Goods section...`);
  1346 | 
  1347 |       // Scroll to Finish Goods section
  1348 |       await this.page.evaluate(() => {
  1349 |         const finishGoodsElement = document.querySelector('[id*="FinishGoods"]');
  1350 |         if (finishGoodsElement) {
  1351 |           finishGoodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1352 |         }
  1353 |       });
  1354 |       await this.page.waitForTimeout(1000);
  1355 | 
  1356 |       // Find the Finish Goods section using a more robust selector
  1357 |       const finishGoodsSection = this.page.locator('section[id*="FinishGoods"]');
  1358 |       const sectionCount = await finishGoodsSection.count();
  1359 | 
  1360 |       if (sectionCount === 0) {
> 1361 |         throw new Error('Finish Goods section not found on the page');
       |               ^ Error: Finish Goods section not found on the page
  1362 |       }
  1363 | 
  1364 |       // Find all rows in the section that have data (input with non-empty value)
  1365 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
  1366 |       const actualRowCount = await dataRows.count();
  1367 | 
  1368 |       console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
  1369 |       console.log(`\n📊 Actual Rows: ${actualRowCount}`);
  1370 |       console.log(`\n🔍 Verification Results:`);
  1371 |       console.log(`  ✓ Expected: ${expectedCount}`);
  1372 |       console.log(`  ✓ Found: ${actualRowCount}`);
  1373 | 
  1374 |       const allFound = actualRowCount === expectedCount;
  1375 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1376 | 
  1377 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1378 |       if (allFound) {
  1379 |         console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
  1380 |       } else {
  1381 |         console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
  1382 |       }
  1383 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1384 | 
  1385 |       return {
  1386 |         allFound,
  1387 |         expectedCount,
  1388 |         actualCount: actualRowCount,
  1389 |         foundCount: actualRowCount,
  1390 |         missingCount: Math.max(0, expectedCount - actualRowCount),
  1391 |         missingCombinations: []
  1392 |       };
  1393 |     } catch (e) {
  1394 |       console.error('\n✗ Failed to verify Finish Goods combinations:');
  1395 |       console.error(e);
  1396 |       throw e;
  1397 |     }
  1398 |   }
  1399 | 
  1400 |   async selectBuyerPOItemsForFinishGoods() {
  1401 |     try {
  1402 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1403 |       console.log('║         SELECTING BUYER PO ITEMS FOR FINISH GOODS           ║');
  1404 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1405 | 
  1406 |       // Find the Finish Goods table - specifically the data table, not header or cloned versions
  1407 |       const finishGoodsDataTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');
  1408 | 
  1409 |       // Get only the tbody that contains actual data rows (not cloned/virtual scrolling copies)
  1410 |       const dataTableBody = finishGoodsDataTable.locator('tbody').last();
  1411 |       const allRows = dataTableBody.locator('tr[role="row"]:has(td[data-sap-ui-colid*="ItemCode"])');
  1412 |       const totalRows = await allRows.count();
  1413 | 
  1414 |       // First pass: Extract only the itemCodes (don't store row references - they become stale)
  1415 |       const itemCodes: string[] = [];
  1416 |       for (let i = 0; i < totalRows; i++) {
  1417 |         const row = allRows.nth(i);
  1418 |         const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1419 |         const itemCodeInput = itemCodeCell.locator('input').first();
  1420 |         const itemCode = await itemCodeInput.inputValue();
  1421 | 
  1422 |         if (itemCode && itemCode.trim() !== '') {
  1423 |           itemCodes.push(itemCode.trim());
  1424 |         }
  1425 |       }
  1426 | 
  1427 |       const rowCount = itemCodes.length;
  1428 |       console.log(`📋 Found ${rowCount} rows in Finish Goods table`);
  1429 | 
  1430 |       let successCount = 0;
  1431 | 
  1432 |       // Second pass: Process each row with fresh DOM references
  1433 |       for (let i = 0; i < rowCount; i++) {
  1434 |         try {
  1435 |           // Re-fetch rows fresh for each iteration to avoid stale references
  1436 |           const freshRows = finishGoodsDataTable.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[role="row"]:has(td[data-sap-ui-colid*="ItemCode"])');
  1437 |           const row = freshRows.nth(i);
  1438 |           const itemCode = itemCodes[i];
  1439 | 
  1440 |           console.log(`\n  Row ${i + 1}/${rowCount}: ItemCode = ${itemCode}`);
  1441 | 
  1442 |           // Find the BuyerPOItem column cell
  1443 |           const buyerPOItemCell = row.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first();
  1444 | 
  1445 |           // Wait for the cell to be visible
  1446 |           await buyerPOItemCell.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  1447 |           await this.page.waitForTimeout(200);
  1448 | 
  1449 |           // Find the value help button - it's a span with role="button" and id containing "vhi"
  1450 |           // The button is inside a div with class="sapMInputBaseIconContainer"
  1451 |           let valueHelpButton = buyerPOItemCell.locator('span[role="button"][id*="vhi"]').first();
  1452 |           let buttonCount = await valueHelpButton.count();
  1453 | 
  1454 |           if (buttonCount === 0) {
  1455 |             // Try alternative: span with aria-label="Show Value Help"
  1456 |             valueHelpButton = buyerPOItemCell.locator('span[aria-label="Show Value Help"]').first();
  1457 |             buttonCount = await valueHelpButton.count();
  1458 |           }
  1459 | 
  1460 |           if (buttonCount === 0) {
  1461 |             // Try alternative: any span with Icon class and button role
```