# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('//section[@id="apperal.stylemaster::StyleMasterObjectPage--fe::FacetSection::FinishGoods"]') to be visible

```

# Test source

```ts
  1194 |   }
  1195 | 
  1196 |   async clickFinishGoodsGenerateButton() {
  1197 |     try {
  1198 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1199 |       console.log('║           CLICKING FINISH GOODS GENERATE BUTTON            ║');
  1200 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1201 | 
  1202 |       // Scroll to Finish Goods section
  1203 |       console.log('  Scrolling to Finish Goods section...');
  1204 |       await this.page.evaluate(() => {
  1205 |         const finishGoodsSection = document.querySelector('[id*="FinishGoods"]');
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
  1292 |       // Find the Finish Goods section
  1293 |       const finishGoodsSection = this.page.locator('//section[@id="apperal.stylemaster::StyleMasterObjectPage--fe::FacetSection::FinishGoods"]');
> 1294 |       await finishGoodsSection.waitFor({ state: 'visible', timeout: 10000 });
       |                                ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1295 | 
  1296 |       // Find all rows in the section that have data (input with non-empty value)
  1297 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input:not([value=""]))');
  1298 |       const actualRowCount = await dataRows.count();
  1299 | 
  1300 |       console.log(`  ✓ Found ${actualRowCount} non-empty rows`);
  1301 | 
  1302 |       // Get the table title to see the count displayed
  1303 |       const titleSpan = finishGoodsSection.locator('h3 span');
  1304 |       const titleText = await titleSpan.textContent();
  1305 |       console.log(`  ✓ Table title: ${titleText}`);
  1306 | 
  1307 |       console.log(`\n📊 Actual Rows: ${actualRowCount}`);
  1308 |       console.log(`\n🔍 Verification Results:`);
  1309 |       console.log(`  ✓ Expected: ${expectedCount}`);
  1310 |       console.log(`  ✓ Found: ${actualRowCount}`);
  1311 | 
  1312 |       const allFound = actualRowCount === expectedCount;
  1313 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1314 | 
  1315 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1316 |       if (allFound) {
  1317 |         console.log('║ ✓ FINISH GOODS ROW COUNT VERIFIED SUCCESSFULLY            ║');
  1318 |       } else {
  1319 |         console.log('║ ✗ FINISH GOODS ROW COUNT MISMATCH                         ║');
  1320 |       }
  1321 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1322 | 
  1323 |       return {
  1324 |         allFound,
  1325 |         expectedCount,
  1326 |         actualCount: actualRowCount,
  1327 |         foundCount: actualRowCount,
  1328 |         missingCount: Math.max(0, expectedCount - actualRowCount),
  1329 |         missingCombinations: []
  1330 |       };
  1331 |     } catch (e) {
  1332 |       console.error('\n✗ Failed to verify Finish Goods combinations:');
  1333 |       console.error(e);
  1334 |       throw e;
  1335 |     }
  1336 |   }
  1337 | 
  1338 |   async selectBuyerPOItemsForFinishGoods() {
  1339 |     try {
  1340 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1341 |       console.log('║         SELECTING BUYER PO ITEMS FOR FINISH GOODS           ║');
  1342 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1343 | 
  1344 |       // Find the Finish Goods table
  1345 |       const finishGoodsTable = this.page.locator('table[id*="FinishGoods-innerTable-table"]');
  1346 |       const rows = finishGoodsTable.locator('tbody tr[data-sap-ui-rowindex]');
  1347 |       const rowCount = await rows.count();
  1348 | 
  1349 |       console.log(`📋 Found ${rowCount} rows in Finish Goods table`);
  1350 | 
  1351 |       let successCount = 0;
  1352 | 
  1353 |       for (let i = 0; i < rowCount; i++) {
  1354 |         try {
  1355 |           const row = rows.nth(i);
  1356 | 
  1357 |           // Get the ItemCode value from the first column
  1358 |           const itemCodeCell = row.locator('td[data-sap-ui-colid*="ItemCode"]').first();
  1359 |           const itemCodeInput = itemCodeCell.locator('input').first();
  1360 |           const itemCode = await itemCodeInput.inputValue();
  1361 | 
  1362 |           if (!itemCode || itemCode.trim() === '') {
  1363 |             console.log(`  Row ${i + 1}: Skipped (empty ItemCode)`);
  1364 |             continue;
  1365 |           }
  1366 | 
  1367 |           console.log(`  Row ${i + 1}: ItemCode = ${itemCode}`);
  1368 | 
  1369 |           // Find the BuyerPOItem column cell
  1370 |           const buyerPOItemCell = row.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first();
  1371 | 
  1372 |           // Find the value help button within this cell
  1373 |           const valueHelpButton = buyerPOItemCell.locator('[id*="vhi"]').first();
  1374 |           const buttonCount = await valueHelpButton.count();
  1375 | 
  1376 |           if (buttonCount === 0) {
  1377 |             console.log(`    ✗ Value help button not found`);
  1378 |             continue;
  1379 |           }
  1380 | 
  1381 |           // Click the value help button to open dropdown
  1382 |           await valueHelpButton.click();
  1383 |           await this.page.waitForTimeout(800);
  1384 | 
  1385 |           console.log(`    ✓ Dropdown opened`);
  1386 | 
  1387 |           // Find the dropdown popover/listbox
  1388 |           // Look for the table inside the popover that shows the options
  1389 |           const dropdownTable = this.page.locator('[role="grid"] tbody tr[role="row"]').first().locator('..').locator('..');
  1390 | 
  1391 |           // Get all rows from the dropdown
  1392 |           const dropdownRows = this.page.locator('[id*="SuggestTable"] tbody tr[role="row"]');
  1393 |           const dropdownRowCount = await dropdownRows.count();
  1394 | 
```