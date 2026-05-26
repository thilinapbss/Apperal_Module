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
  1119 |             if (code && code.trim()) {
  1120 |               actualCodes.add(code.trim());
  1121 |               if (name && name.trim()) {
  1122 |                 actualNames.set(code.trim(), name.trim());
  1123 |               }
  1124 |             }
  1125 |           }
  1126 | 
  1127 |           console.log(`  [PageDown ${pageDown + 1}] Visible rows: ${visibleCount}, Total codes: ${actualCodes.size}`);
  1128 | 
  1129 |           if (actualCodes.size >= 36) {
  1130 |             console.log(`  ✓ All 36 codes found!`);
  1131 |             break;
  1132 |           }
  1133 |         }
  1134 |       }
  1135 | 
  1136 |       console.log(`\n  ✓ Row extraction complete!`);
  1137 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1138 | 
  1139 |       const actualRowCount = actualCodes.size;
  1140 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1141 | 
  1142 |       console.log('\n🔍 Verification Results:');
  1143 | 
  1144 |       // Check if all expected combinations exist
  1145 |       let foundCount = 0;
  1146 |       const missingCombinations: string[] = [];
  1147 | 
  1148 |       for (const expected of expectedCombinations) {
  1149 |         if (actualCodes.has(expected.code)) {
  1150 |           foundCount++;
  1151 |         } else {
  1152 |           missingCombinations.push(expected.code);
  1153 |         }
  1154 |       }
  1155 | 
  1156 |       const allFound = foundCount === expectedCombinations.length;
  1157 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1158 |       console.log(`  ✓ Found: ${foundCount}`);
  1159 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1160 | 
  1161 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1162 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1163 |         missingCombinations.forEach((code, idx) => {
  1164 |           console.log(`    ${idx + 1}. ${code}`);
  1165 |         });
  1166 |       } else if (missingCombinations.length > 10) {
  1167 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1168 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1169 |           console.log(`    ${idx + 1}. ${code}`);
  1170 |         });
  1171 |       }
  1172 | 
  1173 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1174 |       if (allFound) {
  1175 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1176 |       } else {
  1177 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1178 |       }
  1179 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1180 | 
  1181 |       return {
  1182 |         allFound,
  1183 |         expectedCount: expectedCombinations.length,
  1184 |         actualCount: actualRowCount,
  1185 |         foundCount,
  1186 |         missingCount: missingCombinations.length,
  1187 |         missingCombinations
  1188 |       };
  1189 |     } catch (e) {
  1190 |       console.error('\n✗ Failed to verify Semi-Finish Goods combinations:');
  1191 |       console.error(e);
  1192 |       throw e;
  1193 |     }
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
> 1219 |         throw new Error('Finish Goods Generate button not found');
       |               ^ Error: Finish Goods Generate button not found
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
```