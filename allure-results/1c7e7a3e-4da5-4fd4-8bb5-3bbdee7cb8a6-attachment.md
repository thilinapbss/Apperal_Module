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
  1294 |       await finishGoodsSection.waitFor({ state: 'visible', timeout: 10000 });
  1295 | 
  1296 |       // Find all rows in the section that have data (input with non-empty value)
  1297 |       const dataRows = finishGoodsSection.locator('table tbody tr:has(input[value!=""])');
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
  1337 | }
  1338 | 
       |                         ^ Error: locator.click: Target page, context or browser has been closed
```