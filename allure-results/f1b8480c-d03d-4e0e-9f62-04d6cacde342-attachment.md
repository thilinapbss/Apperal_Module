# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first()

```

# Test source

```ts
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
  1282 |       // Calculate expected combinations (only using Finish Goods routes)
  1283 |       const sizeValues = segmentValues['Size'] || [];
  1284 | 
  1285 |       const expectedCombinations: Array<{ code: string; name: string }> = [];
  1286 | 
  1287 |       // Note: Based on observed behavior, Finish Goods generation appears to only create size combinations
  1288 |       // without the full cartesian product of all segments. This differs from Semi-Finish Goods.
  1289 |       // Generating based on size × route (the simplest combination observed)
  1290 |       for (const size of sizeValues) {
  1291 |         for (const route of finishGoodsRoutes) {
  1292 |           const code = `${size.code}-${route.routeCode}`;
  1293 |           const name = `${size.name}-${route.routeName}`;
  1294 |           expectedCombinations.push({ code, name });
  1295 |         }
  1296 |       }
  1297 | 
  1298 |       console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
  1299 |       console.log(`  Note: Finish Goods generation uses simplified logic (size × route only)`);
  1300 |       console.log(`  Calculation: ${sizeValues.length} sizes × ${finishGoodsRoutes.length} finish goods route(s) = ${expectedCombinations.length}`);
  1301 | 
  1302 |       // Get actual rows from table
  1303 |       console.log(`\n📊 Loading all rows from virtualized table...`);
  1304 |       console.log(`  (Using keyboard navigation to load all rows)`);
  1305 | 
  1306 |       // Extract all item codes using keyboard navigation
  1307 |       const actualCodes: Set<string> = new Set();
  1308 |       const actualNames: Map<string, string> = new Map();
  1309 | 
  1310 |       // Click on the first cell of the table to focus it
  1311 |       const firstCell = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
> 1312 |       await firstCell.click();
       |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  1313 |       await this.page.waitForTimeout(300);
  1314 | 
  1315 |       console.log(`  ✓ Table focused`);
  1316 | 
  1317 |       // Press Ctrl+End to go to the last row to load all rows
  1318 |       await this.page.keyboard.press('Control+End');
  1319 |       await this.page.waitForTimeout(1000);
  1320 | 
  1321 |       console.log(`  ✓ Navigated to end of table`);
  1322 | 
  1323 |       // Now go back to the beginning
  1324 |       await this.page.keyboard.press('Control+Home');
  1325 |       await this.page.waitForTimeout(500);
  1326 | 
  1327 |       console.log(`  ✓ Back at beginning of table`);
  1328 | 
  1329 |       // Extract all currently rendered rows
  1330 |       const tableRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1331 |       const totalTableRows = await tableRows.count();
  1332 | 
  1333 |       console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);
  1334 | 
  1335 |       // Extract from all visible rows with error handling
  1336 |       for (let i = 0; i < totalTableRows; i++) {
  1337 |         try {
  1338 |           const row = tableRows.nth(i);
  1339 |           const cells = row.locator('td[role="gridcell"]');
  1340 | 
  1341 |           const codeCell = cells.nth(0);
  1342 |           const nameCell = cells.nth(1);
  1343 | 
  1344 |           const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1345 |           const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1346 | 
  1347 |           if (code && code.trim()) {
  1348 |             actualCodes.add(code.trim());
  1349 |             if (name && name.trim()) {
  1350 |               actualNames.set(code.trim(), name.trim());
  1351 |             }
  1352 |           }
  1353 | 
  1354 |           if ((i + 1) % 10 === 0) {
  1355 |             console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
  1356 |           }
  1357 |         } catch (e: unknown) {
  1358 |           // Row extraction failed, possibly out of range
  1359 |           const errorMsg = e instanceof Error ? e.message : String(e);
  1360 |           console.log(`  ⚠️ Failed to extract row ${i}: ${errorMsg}`);
  1361 |           break;
  1362 |         }
  1363 |       }
  1364 | 
  1365 |       // If we still don't have all rows, try scrolling with Page Down
  1366 |       if (actualCodes.size < expectedCombinations.length) {
  1367 |         console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);
  1368 | 
  1369 |         // Click on first row again
  1370 |         await firstCell.click();
  1371 |         await this.page.waitForTimeout(300);
  1372 | 
  1373 |         // Press Page Down multiple times to load more rows
  1374 |         for (let pageDown = 0; pageDown < 10; pageDown++) {
  1375 |           try {
  1376 |             await this.page.keyboard.press('PageDown');
  1377 |             await this.page.waitForTimeout(400);
  1378 | 
  1379 |             // Extract visible rows after each Page Down
  1380 |             const visibleRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1381 |             const visibleCount = await visibleRows.count();
  1382 | 
  1383 |             for (let i = 0; i < visibleCount; i++) {
  1384 |               try {
  1385 |                 const row = visibleRows.nth(i);
  1386 |                 const cells = row.locator('td[role="gridcell"]');
  1387 |                 const codeCell = cells.nth(0);
  1388 |                 const nameCell = cells.nth(1);
  1389 | 
  1390 |                 const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1391 |                 const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1392 | 
  1393 |                 if (code && code.trim()) {
  1394 |                   actualCodes.add(code.trim());
  1395 |                   if (name && name.trim()) {
  1396 |                     actualNames.set(code.trim(), name.trim());
  1397 |                   }
  1398 |                 }
  1399 |               } catch (e: unknown) {
  1400 |                 // Row extraction failed
  1401 |                 break;
  1402 |               }
  1403 |             }
  1404 | 
  1405 |             console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1406 | 
  1407 |             if (actualCodes.size >= expectedCombinations.length) {
  1408 |               console.log(`  ✓ All expected codes found!`);
  1409 |               break;
  1410 |             }
  1411 |           } catch (e: unknown) {
  1412 |             const errorMsg = e instanceof Error ? e.message : String(e);
```