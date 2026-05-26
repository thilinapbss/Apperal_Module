# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
Error: locator.textContent: Error: strict mode violation: locator('section[id*="FinishGoods"]').locator('h3 span') resolved to 2 elements:
    1) <span dir="auto" id="apperal.stylemaster::StyleMasterObjectPage--fe::table::SemiFinishGoods::LineItem::SemiFinishGoods-title-inner">Semi-Finish Goods (36)</span> aka getByText('Semi-Finish Goods (36)')
    2) <span dir="auto" id="apperal.stylemaster::StyleMasterObjectPage--fe::table::FinishGoods::LineItem::FinishGoods-title-inner">Finish Goods (3)</span> aka getByText('Finish Goods (3)')

Call log:
  - waiting for locator('section[id*="FinishGoods"]').locator('h3 span')

```

# Test source

```ts
  1217 |       const count = await generateButton.count();
  1218 |       if (count === 0) {
  1219 |         throw new Error('Finish Goods Generate button not found');
  1220 |       }
  1221 | 
  1222 |       console.log('  ✓ Generate button found');
  1223 |       await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  1224 |       console.log('  ✓ Generate button is visible');
  1225 | 
  1226 |       await generateButton.click();
  1227 |       console.log('  ✓ Generate button clicked');
  1228 | 
  1229 |       // Wait for the generation process
  1230 |       await this.page.waitForLoadState('networkidle');
  1231 |       await this.page.waitForTimeout(1000);
  1232 | 
  1233 |       console.log('\n║ ✓ Finish Goods data generated successfully');
  1234 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1235 | 
  1236 |       return true;
  1237 |     } catch (e) {
  1238 |       console.error('\n✗ Failed to click Finish Goods Generate button:');
  1239 |       console.error(e);
  1240 |       throw e;
  1241 |     }
  1242 |   }
  1243 | 
  1244 |   async verifyFinishGoodsCombinations(
  1245 |     segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
  1246 |     routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  1247 |   ) {
  1248 |     try {
  1249 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1250 |       console.log('║        VERIFYING FINISH GOODS COMBINATIONS                 ║');
  1251 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1252 | 
  1253 |       // Extract segment values
  1254 |       const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
  1255 |       for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
  1256 |         if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  1257 |           segmentValues[segmentType] = segmentData[0].values || [];
  1258 |         }
  1259 |       }
  1260 | 
  1261 |       console.log('📋 Segment Values:');
  1262 |       for (const [segmentType, values] of Object.entries(segmentValues)) {
  1263 |         console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
  1264 |       }
  1265 | 
  1266 |       // Filter routes: only use Finish Goods routes
  1267 |       const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
  1268 |       const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
  1269 | 
  1270 |       console.log('\n📋 Routing Routes:');
  1271 |       if (finishGoodsRoutes.length > 0) {
  1272 |         console.log('  Finish Goods Routes:');
  1273 |         finishGoodsRoutes.forEach(route => {
  1274 |           console.log(`    ${route.routeCode}: ${route.routeName}`);
  1275 |         });
  1276 |       }
  1277 |       console.log('  Semi-Finish Goods Routes (excluded):');
  1278 |       semiFinishGoodsRoutes.forEach(route => {
  1279 |         console.log(`    ${route.routeCode}: ${route.routeName}`);
  1280 |       });
  1281 | 
  1282 |       // Calculate expected count (count of size values)
  1283 |       const sizeValues = segmentValues['Size'] || [];
  1284 |       const expectedCount = sizeValues.length;
  1285 | 
  1286 |       console.log(`\n📊 Expected Row Count: ${expectedCount}`);
  1287 |       console.log(`  Expected items: ${sizeValues.map(s => `${s.code}(${s.name})`).join(', ')}`);
  1288 | 
  1289 |       // Count non-empty rows in Finish Goods section using XPath
  1290 |       console.log(`\n📊 Counting non-empty rows in Finish Goods section...`);
  1291 | 
  1292 |       // Scroll to Finish Goods section
  1293 |       await this.page.evaluate(() => {
  1294 |         const finishGoodsElement = document.querySelector('[id*="FinishGoods"]');
  1295 |         if (finishGoodsElement) {
  1296 |           finishGoodsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1297 |         }
  1298 |       });
  1299 |       await this.page.waitForTimeout(1000);
  1300 | 
  1301 |       // Find the Finish Goods section using a more robust selector
  1302 |       const finishGoodsSection = this.page.locator('section[id*="FinishGoods"]');
  1303 |       const sectionCount = await finishGoodsSection.count();
  1304 | 
  1305 |       if (sectionCount === 0) {
  1306 |         throw new Error('Finish Goods section not found on the page');
  1307 |       }
  1308 | 
  1309 |       // Find all rows in the section that have data (input with non-empty value)
  1310 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
  1311 |       const actualRowCount = await dataRows.count();
  1312 | 
  1313 |       console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
  1314 | 
  1315 |       // Get the table title to see the count displayed
  1316 |       const titleSpan = finishGoodsSection.locator('h3 span');
> 1317 |       const titleText = await titleSpan.textContent();
       |                                         ^ Error: locator.textContent: Error: strict mode violation: locator('section[id*="FinishGoods"]').locator('h3 span') resolved to 2 elements:
  1318 |       console.log(`  ✓ Table title: ${titleText}`);
  1319 | 
  1320 |       console.log(`\n📊 Actual Rows: ${actualRowCount}`);
  1321 |       console.log(`\n🔍 Verification Results:`);
  1322 |       console.log(`  ✓ Expected: ${expectedCount}`);
  1323 |       console.log(`  ✓ Found: ${actualRowCount}`);
  1324 | 
  1325 |       const allFound = actualRowCount === expectedCount;
  1326 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1327 | 
  1328 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1329 |       if (allFound) {
  1330 |         console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
  1331 |       } else {
  1332 |         console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
  1333 |       }
  1334 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1335 | 
  1336 |       return {
  1337 |         allFound,
  1338 |         expectedCount,
  1339 |         actualCount: actualRowCount,
  1340 |         foundCount: actualRowCount,
  1341 |         missingCount: Math.max(0, expectedCount - actualRowCount),
  1342 |         missingCombinations: []
  1343 |       };
  1344 |     } catch (e) {
  1345 |       console.error('\n✗ Failed to verify Finish Goods combinations:');
  1346 |       console.error(e);
  1347 |       throw e;
  1348 |     }
  1349 |   }
  1350 | 
  1351 |   async selectBuyerPOItemsForFinishGoods() {
  1352 |     try {
  1353 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1354 |       console.log('║         SELECTING BUYER PO ITEMS FOR FINISH GOODS           ║');
  1355 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1356 | 
  1357 |       // Find the Finish Goods table
  1358 |       const finishGoodsTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');
  1359 |       const rows = finishGoodsTable.locator('tbody tr[data-sap-ui-rowindex]');
  1360 |       const rowCount = await rows.count();
  1361 | 
  1362 |       console.log(`📋 Found ${rowCount} rows in Finish Goods table`);
  1363 | 
  1364 |       let successCount = 0;
  1365 | 
  1366 |       for (let i = 0; i < rowCount; i++) {
  1367 |         try {
  1368 |           const row = rows.nth(i);
  1369 | 
  1370 |           // Get the ItemCode value from the first column
  1371 |           const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1372 |           const itemCodeInput = itemCodeCell.locator('input').first();
  1373 |           const itemCode = await itemCodeInput.inputValue();
  1374 | 
  1375 |           if (!itemCode || itemCode.trim() === '') {
  1376 |             console.log(`  Row ${i + 1}: Skipped (empty ItemCode)`);
  1377 |             continue;
  1378 |           }
  1379 | 
  1380 |           console.log(`  Row ${i + 1}: ItemCode = ${itemCode}`);
  1381 | 
  1382 |           // Find the BuyerPOItem column cell
  1383 |           const buyerPOItemCell = row.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first();
  1384 | 
  1385 |           // Find the value help button within this cell
  1386 |           const valueHelpButton = buyerPOItemCell.locator('[id*="vhi"]').first();
  1387 |           const buttonCount = await valueHelpButton.count();
  1388 | 
  1389 |           if (buttonCount === 0) {
  1390 |             console.log(`    ✗ Value help button not found`);
  1391 |             continue;
  1392 |           }
  1393 | 
  1394 |           // Click the value help button to open dropdown
  1395 |           await valueHelpButton.click();
  1396 |           await this.page.waitForTimeout(800);
  1397 | 
  1398 |           console.log(`    ✓ Dropdown opened`);
  1399 | 
  1400 |           // Find the dropdown popover/listbox
  1401 |           // Look for the table inside the popover that shows the options
  1402 |           const dropdownTable = this.page.locator('[role="grid"] tbody tr[role="row"]').first().locator('..').locator('..');
  1403 | 
  1404 |           // Get all rows from the dropdown
  1405 |           const dropdownRows = this.page.locator('[id*="SuggestTable"] tbody tr[role="row"]');
  1406 |           const dropdownRowCount = await dropdownRows.count();
  1407 | 
  1408 |           console.log(`    Found ${dropdownRowCount} items in dropdown`);
  1409 | 
  1410 |           let itemSelected = false;
  1411 | 
  1412 |           for (let j = 0; j < dropdownRowCount; j++) {
  1413 |             try {
  1414 |               const dropdownRow = dropdownRows.nth(j);
  1415 | 
  1416 |               // Get the text from the dropdown item - it's in a span element
  1417 |               const itemTextSpan = dropdownRow.locator('span.sapMText').first();
```