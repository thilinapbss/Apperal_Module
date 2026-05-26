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
  1337 | }
  1338 | 
```