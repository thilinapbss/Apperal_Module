# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
Error: locator.textContent: Page crashed
Call log:
  - waiting for locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]').nth(5).locator('td[role="gridcell"]').first().locator('span[class*="sapMText"]').first()

```

# Test source

```ts
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
  1284 |       const colorValues = segmentValues['Color'] || [];
  1285 |       const seasonValues = segmentValues['Season'] || [];
  1286 | 
  1287 |       const expectedCombinations: Array<{ code: string; name: string }> = [];
  1288 | 
  1289 |       for (const size of sizeValues) {
  1290 |         for (const color of colorValues) {
  1291 |           for (const season of seasonValues) {
  1292 |             for (const route of finishGoodsRoutes) {
  1293 |               const code = `${size.code}-${color.code}-${season.code}-${route.routeCode}`;
  1294 |               const name = `${size.name}-${color.name}-${season.name}-${route.routeName}`;
  1295 |               expectedCombinations.push({ code, name });
  1296 |             }
  1297 |           }
  1298 |         }
  1299 |       }
  1300 | 
  1301 |       console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
  1302 |       console.log(`  Calculation: ${sizeValues.length} sizes × ${colorValues.length} colors × ${seasonValues.length} seasons × ${finishGoodsRoutes.length} finish goods route(s) = ${expectedCombinations.length}`);
  1303 | 
  1304 |       // Get actual rows from table
  1305 |       console.log(`\n📊 Loading all rows from virtualized table...`);
  1306 |       console.log(`  (Using keyboard navigation to load all rows)`);
  1307 | 
  1308 |       // Extract all item codes using keyboard navigation
  1309 |       const actualCodes: Set<string> = new Set();
  1310 |       const actualNames: Map<string, string> = new Map();
  1311 | 
  1312 |       // Click on the first cell of the table to focus it
  1313 |       const firstCell = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
  1314 |       await firstCell.click();
  1315 |       await this.page.waitForTimeout(300);
  1316 | 
  1317 |       console.log(`  ✓ Table focused`);
  1318 | 
  1319 |       // Press Ctrl+End to go to the last row to load all rows
  1320 |       await this.page.keyboard.press('Control+End');
  1321 |       await this.page.waitForTimeout(1000);
  1322 | 
  1323 |       console.log(`  ✓ Navigated to end of table`);
  1324 | 
  1325 |       // Now go back to the beginning
  1326 |       await this.page.keyboard.press('Control+Home');
  1327 |       await this.page.waitForTimeout(500);
  1328 | 
  1329 |       console.log(`  ✓ Back at beginning of table`);
  1330 | 
  1331 |       // Extract all currently rendered rows
  1332 |       const tableRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1333 |       const totalTableRows = await tableRows.count();
  1334 | 
  1335 |       console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);
  1336 | 
  1337 |       // Extract from all visible rows
  1338 |       for (let i = 0; i < totalTableRows; i++) {
  1339 |         const row = tableRows.nth(i);
  1340 |         const cells = row.locator('td[role="gridcell"]');
  1341 | 
  1342 |         const codeCell = cells.nth(0);
  1343 |         const nameCell = cells.nth(1);
  1344 | 
> 1345 |         const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
       |                                                                                ^ Error: locator.textContent: Page crashed
  1346 |         const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1347 | 
  1348 |         if (code && code.trim()) {
  1349 |           actualCodes.add(code.trim());
  1350 |           if (name && name.trim()) {
  1351 |             actualNames.set(code.trim(), name.trim());
  1352 |           }
  1353 |         }
  1354 | 
  1355 |         if ((i + 1) % 10 === 0) {
  1356 |           console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
  1357 |         }
  1358 |       }
  1359 | 
  1360 |       // If we still don't have all rows, try scrolling with Page Down
  1361 |       if (actualCodes.size < expectedCombinations.length) {
  1362 |         console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);
  1363 | 
  1364 |         // Click on first row again
  1365 |         await firstCell.click();
  1366 |         await this.page.waitForTimeout(300);
  1367 | 
  1368 |         // Press Page Down multiple times to load more rows
  1369 |         for (let pageDown = 0; pageDown < 10; pageDown++) {
  1370 |           await this.page.keyboard.press('PageDown');
  1371 |           await this.page.waitForTimeout(400);
  1372 | 
  1373 |           // Extract visible rows after each Page Down
  1374 |           const visibleRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1375 |           const visibleCount = await visibleRows.count();
  1376 | 
  1377 |           for (let i = 0; i < visibleCount; i++) {
  1378 |             const row = visibleRows.nth(i);
  1379 |             const cells = row.locator('td[role="gridcell"]');
  1380 |             const codeCell = cells.nth(0);
  1381 |             const nameCell = cells.nth(1);
  1382 | 
  1383 |             const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1384 |             const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1385 | 
  1386 |             if (code && code.trim()) {
  1387 |               actualCodes.add(code.trim());
  1388 |               if (name && name.trim()) {
  1389 |                 actualNames.set(code.trim(), name.trim());
  1390 |               }
  1391 |             }
  1392 |           }
  1393 | 
  1394 |           console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1395 | 
  1396 |           if (actualCodes.size >= expectedCombinations.length) {
  1397 |             console.log(`  ✓ All expected codes found!`);
  1398 |             break;
  1399 |           }
  1400 |         }
  1401 |       }
  1402 | 
  1403 |       console.log(`\n  ✓ Row extraction complete!`);
  1404 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1405 | 
  1406 |       const actualRowCount = actualCodes.size;
  1407 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1408 | 
  1409 |       console.log('\n🔍 Verification Results:');
  1410 | 
  1411 |       // Check if all expected combinations exist
  1412 |       let foundCount = 0;
  1413 |       const missingCombinations: string[] = [];
  1414 | 
  1415 |       for (const expected of expectedCombinations) {
  1416 |         if (actualCodes.has(expected.code)) {
  1417 |           foundCount++;
  1418 |         } else {
  1419 |           missingCombinations.push(expected.code);
  1420 |         }
  1421 |       }
  1422 | 
  1423 |       const allFound = foundCount === expectedCombinations.length;
  1424 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1425 |       console.log(`  ✓ Found: ${foundCount}`);
  1426 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1427 | 
  1428 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1429 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1430 |         missingCombinations.forEach((code, idx) => {
  1431 |           console.log(`    ${idx + 1}. ${code}`);
  1432 |         });
  1433 |       } else if (missingCombinations.length > 10) {
  1434 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1435 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1436 |           console.log(`    ${idx + 1}. ${code}`);
  1437 |         });
  1438 |       }
  1439 | 
  1440 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1441 |       if (allFound) {
  1442 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1443 |       } else {
  1444 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1445 |       }
```