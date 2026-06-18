# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53e. Click Finish Goods Generate button
- Location: e2e\apparel_regression_testing.spec.ts:1133:7

# Error details

```
Error: Finish Goods Generate button not found
```

# Test source

```ts
  1195 |             if (code && code.trim()) {
  1196 |               actualCodes.add(code.trim());
  1197 |               if (name && name.trim()) {
  1198 |                 actualNames.set(code.trim(), name.trim());
  1199 |               }
  1200 |             }
  1201 |           }
  1202 | 
  1203 |           console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1204 | 
  1205 |           if (actualCodes.size >= 36) {
  1206 |             console.log(`  ✓ All 36 codes found!`);
  1207 |             break;
  1208 |           }
  1209 |         }
  1210 |       }
  1211 | 
  1212 |       console.log(`\n  ✓ Row extraction complete!`);
  1213 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1214 | 
  1215 |       const actualRowCount = actualCodes.size;
  1216 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1217 | 
  1218 |       console.log('\n🔍 Verification Results:');
  1219 | 
  1220 |       // Check if all expected combinations exist
  1221 |       let foundCount = 0;
  1222 |       const missingCombinations: string[] = [];
  1223 | 
  1224 |       for (const expected of expectedCombinations) {
  1225 |         if (actualCodes.has(expected.code)) {
  1226 |           foundCount++;
  1227 |         } else {
  1228 |           missingCombinations.push(expected.code);
  1229 |         }
  1230 |       }
  1231 | 
  1232 |       const allFound = foundCount === expectedCombinations.length;
  1233 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1234 |       console.log(`  ✓ Found: ${foundCount}`);
  1235 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1236 | 
  1237 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1238 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1239 |         missingCombinations.forEach((code, idx) => {
  1240 |           console.log(`    ${idx + 1}. ${code}`);
  1241 |         });
  1242 |       } else if (missingCombinations.length > 10) {
  1243 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1244 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1245 |           console.log(`    ${idx + 1}. ${code}`);
  1246 |         });
  1247 |       }
  1248 | 
  1249 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1250 |       if (allFound) {
  1251 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1252 |       } else {
  1253 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1254 |       }
  1255 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1256 | 
  1257 |       return {
  1258 |         allFound,
  1259 |         expectedCount: expectedCombinations.length,
  1260 |         actualCount: actualRowCount,
  1261 |         foundCount,
  1262 |         missingCount: missingCombinations.length,
  1263 |         missingCombinations
  1264 |       };
  1265 |     } catch (e) {
  1266 |       console.error('\n✗ Failed to verify Semi-Finish Goods combinations:');
  1267 |       console.error(e);
  1268 |       throw e;
  1269 |     }
  1270 |   }
  1271 | 
  1272 |   async clickFinishGoodsGenerateButton() {
  1273 |     try {
  1274 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1275 |       console.log('║           CLICKING FINISH GOODS GENERATE BUTTON            ║');
  1276 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1277 | 
  1278 |       // Scroll to Finish Goods section
  1279 |       console.log('  Scrolling to Finish Goods section...');
  1280 |       await this.page.evaluate(() => {
  1281 |         const finishGoodsSection = document.querySelector('[id*="FinishGoods"]');
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
> 1295 |         throw new Error('Finish Goods Generate button not found');
       |               ^ Error: Finish Goods Generate button not found
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
  1382 |         throw new Error('Finish Goods section not found on the page');
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
```