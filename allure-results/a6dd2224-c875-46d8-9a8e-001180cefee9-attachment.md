# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Target page, context or browser has been closed
```

# Test source

```ts
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
  1287 |       // Note: Based on observed behavior, Finish Goods generation only displays size codes
  1288 |       // The table shows just the size segment values without route information
  1289 |       for (const size of sizeValues) {
  1290 |         expectedCombinations.push({ code: size.code, name: size.name });
  1291 |       }
  1292 | 
  1293 |       console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
  1294 |       console.log(`  Note: Finish Goods table displays size codes only`);
  1295 |       console.log(`  Expected items: ${sizeValues.map(s => `${s.code}(${s.name})`).join(', ')}`);
  1296 | 
  1297 |       // Get actual rows from table
  1298 |       console.log(`\n📊 Loading all rows from virtualized table...`);
  1299 |       console.log(`  (Using keyboard navigation to load all rows)`);
  1300 | 
  1301 |       // Extract all item codes using keyboard navigation
  1302 |       const actualCodes: Set<string> = new Set();
  1303 |       const actualNames: Map<string, string> = new Map();
  1304 | 
  1305 |       // Click on the first cell of the table to focus it
  1306 |       const firstCell = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
  1307 |       await firstCell.click();
  1308 |       await this.page.waitForTimeout(300);
  1309 | 
  1310 |       console.log(`  ✓ Table focused`);
  1311 | 
  1312 |       // Press Ctrl+End to go to the last row to load all rows
  1313 |       await this.page.keyboard.press('Control+End');
  1314 |       await this.page.waitForTimeout(1000);
  1315 | 
  1316 |       console.log(`  ✓ Navigated to end of table`);
  1317 | 
  1318 |       // Now go back to the beginning
  1319 |       await this.page.keyboard.press('Control+Home');
  1320 |       await this.page.waitForTimeout(500);
  1321 | 
  1322 |       console.log(`  ✓ Back at beginning of table`);
  1323 | 
  1324 |       // Extract all currently rendered rows
  1325 |       const tableRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1326 |       const totalTableRows = await tableRows.count();
  1327 | 
  1328 |       console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);
  1329 | 
  1330 |       // Extract from all visible rows with error handling
  1331 |       for (let i = 0; i < totalTableRows; i++) {
  1332 |         try {
  1333 |           const row = tableRows.nth(i);
  1334 |           const cells = row.locator('td[role="gridcell"]');
  1335 | 
  1336 |           const codeCell = cells.nth(0);
  1337 |           const nameCell = cells.nth(1);
  1338 | 
  1339 |           // Try to get text from input fields first, then span elements
  1340 |           let code = await codeCell.locator('input').first().inputValue().catch(() => null);
  1341 |           if (!code) {
  1342 |             code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1343 |           }
  1344 | 
  1345 |           let name = await nameCell.locator('input').first().inputValue().catch(() => null);
  1346 |           if (!name) {
  1347 |             name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1348 |           }
  1349 | 
  1350 |           if (code && code.trim()) {
  1351 |             actualCodes.add(code.trim());
  1352 |             if (name && name.trim()) {
  1353 |               actualNames.set(code.trim(), name.trim());
  1354 |             }
  1355 |           }
  1356 | 
  1357 |           if ((i + 1) % 10 === 0) {
  1358 |             console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
  1359 |           }
  1360 |         } catch (e: unknown) {
  1361 |           // Row extraction failed, possibly out of range
  1362 |           const errorMsg = e instanceof Error ? e.message : String(e);
  1363 |           console.log(`  ⚠️ Failed to extract row ${i}: ${errorMsg}`);
  1364 |           break;
  1365 |         }
  1366 |       }
  1367 | 
  1368 |       // If we still don't have all rows, try scrolling with Page Down
  1369 |       if (actualCodes.size < expectedCombinations.length) {
  1370 |         console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);
  1371 | 
  1372 |         // Click on first row again
> 1373 |         await firstCell.click();
       |                         ^ Error: locator.click: Target page, context or browser has been closed
  1374 |         await this.page.waitForTimeout(300);
  1375 | 
  1376 |         // Press Page Down multiple times to load more rows
  1377 |         for (let pageDown = 0; pageDown < 10; pageDown++) {
  1378 |           try {
  1379 |             await this.page.keyboard.press('PageDown');
  1380 |             await this.page.waitForTimeout(400);
  1381 | 
  1382 |             // Extract visible rows after each Page Down
  1383 |             const visibleRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1384 |             const visibleCount = await visibleRows.count();
  1385 | 
  1386 |             for (let i = 0; i < visibleCount; i++) {
  1387 |               try {
  1388 |                 const row = visibleRows.nth(i);
  1389 |                 const cells = row.locator('td[role="gridcell"]');
  1390 |                 const codeCell = cells.nth(0);
  1391 |                 const nameCell = cells.nth(1);
  1392 | 
  1393 |                 // Try to get text from input fields first, then span elements
  1394 |                 let code = await codeCell.locator('input').first().inputValue().catch(() => null);
  1395 |                 if (!code) {
  1396 |                   code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1397 |                 }
  1398 | 
  1399 |                 let name = await nameCell.locator('input').first().inputValue().catch(() => null);
  1400 |                 if (!name) {
  1401 |                   name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1402 |                 }
  1403 | 
  1404 |                 if (code && code.trim()) {
  1405 |                   actualCodes.add(code.trim());
  1406 |                   if (name && name.trim()) {
  1407 |                     actualNames.set(code.trim(), name.trim());
  1408 |                   }
  1409 |                 }
  1410 |               } catch (e: unknown) {
  1411 |                 // Row extraction failed
  1412 |                 break;
  1413 |               }
  1414 |             }
  1415 | 
  1416 |             console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1417 | 
  1418 |             if (actualCodes.size >= expectedCombinations.length) {
  1419 |               console.log(`  ✓ All expected codes found!`);
  1420 |               break;
  1421 |             }
  1422 |           } catch (e: unknown) {
  1423 |             const errorMsg = e instanceof Error ? e.message : String(e);
  1424 |             console.log(`  ⚠️ PageDown iteration failed: ${errorMsg}`);
  1425 |             break;
  1426 |           }
  1427 |         }
  1428 |       }
  1429 | 
  1430 |       console.log(`\n  ✓ Row extraction complete!`);
  1431 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1432 | 
  1433 |       const actualRowCount = actualCodes.size;
  1434 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1435 | 
  1436 |       console.log('\n🔍 Verification Results:');
  1437 | 
  1438 |       // Check if all expected combinations exist
  1439 |       let foundCount = 0;
  1440 |       const missingCombinations: string[] = [];
  1441 | 
  1442 |       for (const expected of expectedCombinations) {
  1443 |         if (actualCodes.has(expected.code)) {
  1444 |           foundCount++;
  1445 |         } else {
  1446 |           missingCombinations.push(expected.code);
  1447 |         }
  1448 |       }
  1449 | 
  1450 |       const allFound = foundCount === expectedCombinations.length;
  1451 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1452 |       console.log(`  ✓ Found: ${foundCount}`);
  1453 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1454 | 
  1455 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1456 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1457 |         missingCombinations.forEach((code, idx) => {
  1458 |           console.log(`    ${idx + 1}. ${code}`);
  1459 |         });
  1460 |       } else if (missingCombinations.length > 10) {
  1461 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1462 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1463 |           console.log(`    ${idx + 1}. ${code}`);
  1464 |         });
  1465 |       }
  1466 | 
  1467 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1468 |       if (allFound) {
  1469 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1470 |       } else {
  1471 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1472 |       }
  1473 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
```