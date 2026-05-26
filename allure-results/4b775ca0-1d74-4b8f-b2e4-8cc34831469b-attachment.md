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
  1206 |         if (finishGoodsSection) {
  1207 |           finishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1208 |         }
  1209 |       });
  1210 |       await this.page.waitForTimeout(1000);
  1211 | 
  1212 |       // Find and click the Generate button
  1213 |       const generateButton = this.page.locator(
  1214 |         'button[id*="FinishGoods::CustomAction::RefreshFinishGoods"]'
  1215 |       );
  1216 | 
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
> 1306 |         throw new Error('Finish Goods section not found on the page');
       |               ^ Error: Finish Goods section not found on the page
  1307 |       }
  1308 | 
  1309 |       // Find all rows in the section that have data (input with non-empty value)
  1310 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
  1311 |       const actualRowCount = await dataRows.count();
  1312 | 
  1313 |       console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
  1314 |       console.log(`\n📊 Actual Rows: ${actualRowCount}`);
  1315 |       console.log(`\n🔍 Verification Results:`);
  1316 |       console.log(`  ✓ Expected: ${expectedCount}`);
  1317 |       console.log(`  ✓ Found: ${actualRowCount}`);
  1318 | 
  1319 |       const allFound = actualRowCount === expectedCount;
  1320 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1321 | 
  1322 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1323 |       if (allFound) {
  1324 |         console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
  1325 |       } else {
  1326 |         console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
  1327 |       }
  1328 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1329 | 
  1330 |       return {
  1331 |         allFound,
  1332 |         expectedCount,
  1333 |         actualCount: actualRowCount,
  1334 |         foundCount: actualRowCount,
  1335 |         missingCount: Math.max(0, expectedCount - actualRowCount),
  1336 |         missingCombinations: []
  1337 |       };
  1338 |     } catch (e) {
  1339 |       console.error('\n✗ Failed to verify Finish Goods combinations:');
  1340 |       console.error(e);
  1341 |       throw e;
  1342 |     }
  1343 |   }
  1344 | 
  1345 |   async selectBuyerPOItemsForFinishGoods() {
  1346 |     try {
  1347 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1348 |       console.log('║         SELECTING BUYER PO ITEMS FOR FINISH GOODS           ║');
  1349 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1350 | 
  1351 |       // Find the Finish Goods table
  1352 |       const finishGoodsTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');
  1353 |       const rows = finishGoodsTable.locator('tbody tr[data-sap-ui-rowindex]');
  1354 |       const rowCount = await rows.count();
  1355 | 
  1356 |       console.log(`📋 Found ${rowCount} rows in Finish Goods table`);
  1357 | 
  1358 |       let successCount = 0;
  1359 | 
  1360 |       for (let i = 0; i < rowCount; i++) {
  1361 |         try {
  1362 |           const row = rows.nth(i);
  1363 | 
  1364 |           // Get the ItemCode value from the first column
  1365 |           const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1366 |           const itemCodeInput = itemCodeCell.locator('input').first();
  1367 |           const itemCode = await itemCodeInput.inputValue();
  1368 | 
  1369 |           if (!itemCode || itemCode.trim() === '') {
  1370 |             console.log(`  Row ${i + 1}: Skipped (empty ItemCode)`);
  1371 |             continue;
  1372 |           }
  1373 | 
  1374 |           console.log(`  Row ${i + 1}: ItemCode = ${itemCode}`);
  1375 | 
  1376 |           // Find the BuyerPOItem column cell
  1377 |           const buyerPOItemCell = row.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first();
  1378 | 
  1379 |           // Find the value help button within this cell
  1380 |           const valueHelpButton = buyerPOItemCell.locator('[id*="vhi"]').first();
  1381 |           const buttonCount = await valueHelpButton.count();
  1382 | 
  1383 |           if (buttonCount === 0) {
  1384 |             console.log(`    ✗ Value help button not found`);
  1385 |             continue;
  1386 |           }
  1387 | 
  1388 |           // Click the value help button to open dropdown
  1389 |           await valueHelpButton.click();
  1390 |           await this.page.waitForTimeout(800);
  1391 | 
  1392 |           console.log(`    ✓ Dropdown opened`);
  1393 | 
  1394 |           // Find the dropdown popover/listbox
  1395 |           // Look for the table inside the popover that shows the options
  1396 |           const dropdownTable = this.page.locator('[role="grid"] tbody tr[role="row"]').first().locator('..').locator('..');
  1397 | 
  1398 |           // Get all rows from the dropdown
  1399 |           const dropdownRows = this.page.locator('[id*="SuggestTable"] tbody tr[role="row"]');
  1400 |           const dropdownRowCount = await dropdownRows.count();
  1401 | 
  1402 |           console.log(`    Found ${dropdownRowCount} items in dropdown`);
  1403 | 
  1404 |           let itemSelected = false;
  1405 | 
  1406 |           for (let j = 0; j < dropdownRowCount; j++) {
```