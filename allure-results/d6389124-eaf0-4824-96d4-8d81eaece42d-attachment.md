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
  1078 |         const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1079 |         const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1080 | 
  1081 |         if (code && code.trim()) {
  1082 |           actualCodes.add(code.trim());
  1083 |           if (name && name.trim()) {
  1084 |             actualNames.set(code.trim(), name.trim());
  1085 |           }
  1086 |         }
  1087 | 
  1088 |         if ((i + 1) % 10 === 0) {
  1089 |           console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
  1090 |         }
  1091 |       }
  1092 | 
  1093 |       // If we still don't have all rows, try scrolling with Page Down
  1094 |       if (actualCodes.size < 36) {
  1095 |         console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);
  1096 | 
  1097 |         // Click on first row again
  1098 |         await firstCell.click();
  1099 |         await this.page.waitForTimeout(300);
  1100 | 
  1101 |         // Press Page Down multiple times to load more rows
  1102 |         for (let pageDown = 0; pageDown < 10; pageDown++) {
  1103 |           await this.page.keyboard.press('PageDown');
  1104 |           await this.page.waitForTimeout(400);
  1105 | 
  1106 |           // Extract visible rows after each Page Down
  1107 |           const visibleRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1108 |           const visibleCount = await visibleRows.count();
  1109 | 
  1110 |           for (let i = 0; i < visibleCount; i++) {
  1111 |             const row = visibleRows.nth(i);
  1112 |             const cells = row.locator('td[role="gridcell"]');
  1113 |             const codeCell = cells.nth(0);
  1114 |             const nameCell = cells.nth(1);
  1115 | 
  1116 |             const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1117 |             const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1118 | 
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
> 1178 |       }
       |                                ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
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
```