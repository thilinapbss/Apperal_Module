# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53e. Click Finish Goods Generate button
- Location: e2e\apparel_regression_testing.spec.ts:1131:7

# Error details

```
Error: Finish Goods Generate button not found
```

# Test source

```ts
  1174 |             if (code && code.trim()) {
  1175 |               actualCodes.add(code.trim());
  1176 |               if (name && name.trim()) {
  1177 |                 actualNames.set(code.trim(), name.trim());
  1178 |               }
  1179 |             }
  1180 |           }
  1181 | 
  1182 |           console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1183 | 
  1184 |           if (actualCodes.size >= 36) {
  1185 |             console.log(`  ✓ All 36 codes found!`);
  1186 |             break;
  1187 |           }
  1188 |         }
  1189 |       }
  1190 | 
  1191 |       console.log(`\n  ✓ Row extraction complete!`);
  1192 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1193 | 
  1194 |       const actualRowCount = actualCodes.size;
  1195 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1196 | 
  1197 |       console.log('\n🔍 Verification Results:');
  1198 | 
  1199 |       // Check if all expected combinations exist
  1200 |       let foundCount = 0;
  1201 |       const missingCombinations: string[] = [];
  1202 | 
  1203 |       for (const expected of expectedCombinations) {
  1204 |         if (actualCodes.has(expected.code)) {
  1205 |           foundCount++;
  1206 |         } else {
  1207 |           missingCombinations.push(expected.code);
  1208 |         }
  1209 |       }
  1210 | 
  1211 |       const allFound = foundCount === expectedCombinations.length;
  1212 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1213 |       console.log(`  ✓ Found: ${foundCount}`);
  1214 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1215 | 
  1216 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1217 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1218 |         missingCombinations.forEach((code, idx) => {
  1219 |           console.log(`    ${idx + 1}. ${code}`);
  1220 |         });
  1221 |       } else if (missingCombinations.length > 10) {
  1222 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1223 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1224 |           console.log(`    ${idx + 1}. ${code}`);
  1225 |         });
  1226 |       }
  1227 | 
  1228 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1229 |       if (allFound) {
  1230 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1231 |       } else {
  1232 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1233 |       }
  1234 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1235 | 
  1236 |       return {
  1237 |         allFound,
  1238 |         expectedCount: expectedCombinations.length,
  1239 |         actualCount: actualRowCount,
  1240 |         foundCount,
  1241 |         missingCount: missingCombinations.length,
  1242 |         missingCombinations
  1243 |       };
  1244 |     } catch (e) {
  1245 |       console.error('\n✗ Failed to verify Semi-Finish Goods combinations:');
  1246 |       console.error(e);
  1247 |       throw e;
  1248 |     }
  1249 |   }
  1250 | 
  1251 |   async clickFinishGoodsGenerateButton() {
  1252 |     try {
  1253 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1254 |       console.log('║           CLICKING FINISH GOODS GENERATE BUTTON            ║');
  1255 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1256 | 
  1257 |       // Scroll to Finish Goods section
  1258 |       console.log('  Scrolling to Finish Goods section...');
  1259 |       await this.page.evaluate(() => {
  1260 |         const finishGoodsSection = document.querySelector('[id*="FinishGoods"]');
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
> 1274 |         throw new Error('Finish Goods Generate button not found');
       |               ^ Error: Finish Goods Generate button not found
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
  1361 |         throw new Error('Finish Goods section not found on the page');
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
```