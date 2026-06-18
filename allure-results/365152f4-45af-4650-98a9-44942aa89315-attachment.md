# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53d. Verify Semi-Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1093:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first()

```

# Test source

```ts
  1023 |         'button[id*="SemiFinishGoods::CustomAction::RefreshSemiFinishGoods"]'
  1024 |       );
  1025 | 
  1026 |       const count = await generateButton.count();
  1027 |       if (count === 0) {
  1028 |         throw new Error('Semi-Finish Goods Generate button not found');
  1029 |       }
  1030 | 
  1031 |       console.log('  ✓ Generate button found');
  1032 |       await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  1033 |       console.log('  ✓ Generate button is visible');
  1034 | 
  1035 |       await generateButton.click();
  1036 |       console.log('  ✓ Generate button clicked');
  1037 | 
  1038 |       // Wait for the generation process
  1039 |       await this.page.waitForLoadState('networkidle');
  1040 |       await this.page.waitForTimeout(1000);
  1041 | 
  1042 |       console.log('\n║ ✓ Semi-Finish Goods data generated successfully');
  1043 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1044 | 
  1045 |       return true;
  1046 |     } catch (e) {
  1047 |       console.error('\n✗ Failed to click Semi-Finish Goods Generate button:');
  1048 |       console.error(e);
  1049 |       throw e;
  1050 |     }
  1051 |   }
  1052 | 
  1053 |   async verifySemiFinishGoodsCombinations(
  1054 |     segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
  1055 |     routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  1056 |   ) {
  1057 |     try {
  1058 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1059 |       console.log('║      VERIFYING SEMI-FINISH GOODS COMBINATIONS              ║');
  1060 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1061 | 
  1062 |       // Extract segment values
  1063 |       const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
  1064 |       for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
  1065 |         if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  1066 |           segmentValues[segmentType] = segmentData[0].values || [];
  1067 |         }
  1068 |       }
  1069 | 
  1070 |       console.log('📋 Segment Values:');
  1071 |       for (const [segmentType, values] of Object.entries(segmentValues)) {
  1072 |         console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
  1073 |       }
  1074 | 
  1075 |       // Filter routes: only use Semi-Finish Goods routes
  1076 |       const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
  1077 |       const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
  1078 | 
  1079 |       console.log('\n📋 Routing Routes:');
  1080 |       console.log('  Semi-Finish Goods Routes:');
  1081 |       semiFinishGoodsRoutes.forEach(route => {
  1082 |         console.log(`    ${route.routeCode}: ${route.routeName}`);
  1083 |       });
  1084 |       if (finishGoodsRoutes.length > 0) {
  1085 |         console.log('  Finish Goods Routes (excluded):');
  1086 |         finishGoodsRoutes.forEach(route => {
  1087 |           console.log(`    ${route.routeCode}: ${route.routeName}`);
  1088 |         });
  1089 |       }
  1090 | 
  1091 |       // Calculate expected combinations (only using Semi-Finish Goods routes)
  1092 |       const sizeValues = segmentValues['Size'] || [];
  1093 |       const colorValues = segmentValues['Color'] || [];
  1094 |       const seasonValues = segmentValues['Season'] || [];
  1095 | 
  1096 |       const expectedCombinations: Array<{ code: string; name: string }> = [];
  1097 | 
  1098 |       for (const size of sizeValues) {
  1099 |         for (const color of colorValues) {
  1100 |           for (const season of seasonValues) {
  1101 |             for (const route of semiFinishGoodsRoutes) {
  1102 |               const code = `${size.code}-${color.code}-${season.code}-${route.routeCode}`;
  1103 |               const name = `${size.name}-${color.name}-${season.name}-${route.routeName}`;
  1104 |               expectedCombinations.push({ code, name });
  1105 |             }
  1106 |           }
  1107 |         }
  1108 |       }
  1109 | 
  1110 |       console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
  1111 |       console.log(`  Calculation: ${sizeValues.length} sizes × ${colorValues.length} colors × ${seasonValues.length} seasons × ${semiFinishGoodsRoutes.length} semi-finish routes = ${expectedCombinations.length}`);
  1112 | 
  1113 |       // Get actual rows from table
  1114 |       console.log(`\n📊 Loading all rows from virtualized table...`);
  1115 |       console.log(`  (Using keyboard navigation to load all rows)`);
  1116 | 
  1117 |       // Extract all item codes using keyboard navigation
  1118 |       const actualCodes: Set<string> = new Set();
  1119 |       const actualNames: Map<string, string> = new Map();
  1120 | 
  1121 |       // Click on the first cell of the table to focus it
  1122 |       const firstCell = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
> 1123 |       await firstCell.click();
       |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  1124 |       await this.page.waitForTimeout(300);
  1125 | 
  1126 |       console.log(`  ✓ Table focused`);
  1127 | 
  1128 |       // Press Ctrl+End to go to the last row to load all rows
  1129 |       await this.page.keyboard.press('Control+End');
  1130 |       await this.page.waitForTimeout(1000);
  1131 | 
  1132 |       console.log(`  ✓ Navigated to end of table`);
  1133 | 
  1134 |       // Now go back to the beginning
  1135 |       await this.page.keyboard.press('Control+Home');
  1136 |       await this.page.waitForTimeout(500);
  1137 | 
  1138 |       console.log(`  ✓ Back at beginning of table`);
  1139 | 
  1140 |       // Extract all currently rendered rows
  1141 |       const tableRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1142 |       const totalTableRows = await tableRows.count();
  1143 | 
  1144 |       console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);
  1145 | 
  1146 |       // Extract from all visible rows
  1147 |       for (let i = 0; i < totalTableRows; i++) {
  1148 |         const row = tableRows.nth(i);
  1149 |         const cells = row.locator('td[role="gridcell"]');
  1150 | 
  1151 |         const codeCell = cells.nth(0);
  1152 |         const nameCell = cells.nth(1);
  1153 | 
  1154 |         const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1155 |         const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1156 | 
  1157 |         if (code && code.trim()) {
  1158 |           actualCodes.add(code.trim());
  1159 |           if (name && name.trim()) {
  1160 |             actualNames.set(code.trim(), name.trim());
  1161 |           }
  1162 |         }
  1163 | 
  1164 |         if ((i + 1) % 10 === 0) {
  1165 |           console.log(`  Extracted from rows 1-${i + 1}: ${actualCodes.size} unique codes`);
  1166 |         }
  1167 |       }
  1168 | 
  1169 |       // If we still don't have all rows, try scrolling with Page Down
  1170 |       if (actualCodes.size < 36) {
  1171 |         console.log(`\n  ⚠️ Found only ${actualCodes.size} codes, attempting Page Down scrolling...`);
  1172 | 
  1173 |         // Click on first row again
  1174 |         await firstCell.click();
  1175 |         await this.page.waitForTimeout(300);
  1176 | 
  1177 |         // Press Page Down multiple times to load more rows
  1178 |         for (let pageDown = 0; pageDown < 10; pageDown++) {
  1179 |           await this.page.keyboard.press('PageDown');
  1180 |           await this.page.waitForTimeout(400);
  1181 | 
  1182 |           // Extract visible rows after each Page Down
  1183 |           const visibleRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1184 |           const visibleCount = await visibleRows.count();
  1185 | 
  1186 |           for (let i = 0; i < visibleCount; i++) {
  1187 |             const row = visibleRows.nth(i);
  1188 |             const cells = row.locator('td[role="gridcell"]');
  1189 |             const codeCell = cells.nth(0);
  1190 |             const nameCell = cells.nth(1);
  1191 | 
  1192 |             const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1193 |             const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1194 | 
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
```