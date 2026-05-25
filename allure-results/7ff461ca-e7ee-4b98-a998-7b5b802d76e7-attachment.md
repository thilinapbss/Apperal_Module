# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 57. Comprehensive verification of all Semi-Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1292:7

# Error details

```
TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[id*="SemiFinishGoods-innerTable-sapUiTableCtrlScr"]').first()

```

# Test source

```ts
  949  | 
  950  |       const count = await generateButton.count();
  951  |       if (count === 0) {
  952  |         throw new Error('Semi-Finish Goods Generate button not found');
  953  |       }
  954  | 
  955  |       console.log('  ✓ Generate button found');
  956  |       await generateButton.waitFor({ state: 'visible', timeout: 10000 });
  957  |       console.log('  ✓ Generate button is visible');
  958  | 
  959  |       await generateButton.click();
  960  |       console.log('  ✓ Generate button clicked');
  961  | 
  962  |       // Wait for the generation process
  963  |       await this.page.waitForLoadState('networkidle');
  964  |       await this.page.waitForTimeout(1000);
  965  | 
  966  |       console.log('\n║ ✓ Semi-Finish Goods data generated successfully');
  967  |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  968  | 
  969  |       return true;
  970  |     } catch (e) {
  971  |       console.error('\n✗ Failed to click Semi-Finish Goods Generate button:');
  972  |       console.error(e);
  973  |       throw e;
  974  |     }
  975  |   }
  976  | 
  977  |   async verifySemiFinishGoodsCombinations(
  978  |     segmentsData: { [key: string]: Array<{ code: string; name: string; values: Array<{ code: string; name: string }> }> },
  979  |     routingPlans: Array<{ routeCode: string; routeName: string; isSemiFinishGood?: boolean }>
  980  |   ) {
  981  |     try {
  982  |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  983  |       console.log('║      VERIFYING SEMI-FINISH GOODS COMBINATIONS              ║');
  984  |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  985  | 
  986  |       // Extract segment values
  987  |       const segmentValues: { [key: string]: Array<{ code: string; name: string }> } = {};
  988  |       for (const [segmentType, segmentData] of Object.entries(segmentsData)) {
  989  |         if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  990  |           segmentValues[segmentType] = segmentData[0].values || [];
  991  |         }
  992  |       }
  993  | 
  994  |       console.log('📋 Segment Values:');
  995  |       for (const [segmentType, values] of Object.entries(segmentValues)) {
  996  |         console.log(`  ${segmentType}: ${values.map(v => `${v.code}(${v.name})`).join(', ')}`);
  997  |       }
  998  | 
  999  |       // Filter routes: only use Semi-Finish Goods routes
  1000 |       const semiFinishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood !== false);
  1001 |       const finishGoodsRoutes = routingPlans.filter(route => route.isSemiFinishGood === false);
  1002 | 
  1003 |       console.log('\n📋 Routing Routes:');
  1004 |       console.log('  Semi-Finish Goods Routes:');
  1005 |       semiFinishGoodsRoutes.forEach(route => {
  1006 |         console.log(`    ${route.routeCode}: ${route.routeName}`);
  1007 |       });
  1008 |       if (finishGoodsRoutes.length > 0) {
  1009 |         console.log('  Finish Goods Routes (excluded):');
  1010 |         finishGoodsRoutes.forEach(route => {
  1011 |           console.log(`    ${route.routeCode}: ${route.routeName}`);
  1012 |         });
  1013 |       }
  1014 | 
  1015 |       // Calculate expected combinations (only using Semi-Finish Goods routes)
  1016 |       const sizeValues = segmentValues['Size'] || [];
  1017 |       const colorValues = segmentValues['Color'] || [];
  1018 |       const seasonValues = segmentValues['Season'] || [];
  1019 | 
  1020 |       const expectedCombinations: Array<{ code: string; name: string }> = [];
  1021 | 
  1022 |       for (const size of sizeValues) {
  1023 |         for (const color of colorValues) {
  1024 |           for (const season of seasonValues) {
  1025 |             for (const route of semiFinishGoodsRoutes) {
  1026 |               const code = `${size.code}-${color.code}-${season.code}-${route.routeCode}`;
  1027 |               const name = `${size.name}-${color.name}-${season.name}-${route.routeName}`;
  1028 |               expectedCombinations.push({ code, name });
  1029 |             }
  1030 |           }
  1031 |         }
  1032 |       }
  1033 | 
  1034 |       console.log(`\n📊 Expected Combinations: ${expectedCombinations.length}`);
  1035 |       console.log(`  Calculation: ${sizeValues.length} sizes × ${colorValues.length} colors × ${seasonValues.length} seasons × ${semiFinishGoodsRoutes.length} semi-finish routes = ${expectedCombinations.length}`);
  1036 | 
  1037 |       // Get actual rows from table
  1038 |       console.log(`\n📊 Loading all rows from virtualized table...`);
  1039 |       console.log(`  (Scrolling one row at a time - 49px per row)`);
  1040 | 
  1041 |       // Get the scrollable container (SAP UI5 table structure)
  1042 |       const scrollContainer = this.page.locator('[id*="SemiFinishGoods-innerTable-sapUiTableCtrlScr"]').first();
  1043 | 
  1044 |       // Extract all item codes by scrolling through the table
  1045 |       const actualCodes: Set<string> = new Set();
  1046 |       const actualNames: Map<string, string> = new Map();
  1047 | 
  1048 |       // Scroll to top first
> 1049 |       await scrollContainer.evaluate(el => {
       |                             ^ TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
  1050 |         el.scrollTop = 0;
  1051 |       });
  1052 |       await this.page.waitForTimeout(500);
  1053 | 
  1054 |       // Get the total height to scroll
  1055 |       const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight);
  1056 |       const viewportHeight = await scrollContainer.evaluate(el => el.clientHeight);
  1057 |       const rowHeight = 49; // Each row is 49px high
  1058 | 
  1059 |       console.log(`  Table total height: ${scrollHeight}px, Viewport: ${viewportHeight}px, Row height: ${rowHeight}px`);
  1060 | 
  1061 |       // Calculate total rows: (scrollHeight - viewportHeight) / rowHeight + visible rows
  1062 |       const totalRowsEstimate = Math.ceil(scrollHeight / rowHeight);
  1063 |       console.log(`  Estimated total rows: ${totalRowsEstimate}`);
  1064 | 
  1065 |       // Scroll through entire table one row at a time
  1066 |       let currentScrollTop = 0;
  1067 |       let scrollIteration = 0;
  1068 | 
  1069 |       while (currentScrollTop <= scrollHeight - viewportHeight + rowHeight) {
  1070 |         // Extract all currently visible rows
  1071 |         const tableRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1072 |         const currentRowCount = await tableRows.count();
  1073 | 
  1074 |         if (scrollIteration % 5 === 0) {
  1075 |           console.log(`  [Iteration ${scrollIteration}] Scroll: ${currentScrollTop}px - Visible rows: ${currentRowCount}, Total codes: ${actualCodes.size}`);
  1076 |         }
  1077 | 
  1078 |         // Extract codes from all visible rows
  1079 |         for (let i = 0; i < currentRowCount; i++) {
  1080 |           const row = tableRows.nth(i);
  1081 |           const cells = row.locator('td[role="gridcell"]');
  1082 | 
  1083 |           const codeCell = cells.nth(0);
  1084 |           const nameCell = cells.nth(1);
  1085 | 
  1086 |           const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1087 |           const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1088 | 
  1089 |           if (code && code.trim()) {
  1090 |             actualCodes.add(code.trim());
  1091 |             if (name && name.trim()) {
  1092 |               actualNames.set(code.trim(), name.trim());
  1093 |             }
  1094 |           }
  1095 |         }
  1096 | 
  1097 |         // Scroll down by one row (49px)
  1098 |         currentScrollTop += rowHeight;
  1099 |         await scrollContainer.evaluate((el, pos) => {
  1100 |           el.scrollTop = pos;
  1101 |         }, currentScrollTop);
  1102 |         await this.page.waitForTimeout(200);
  1103 |         scrollIteration++;
  1104 |       }
  1105 | 
  1106 |       console.log(`\n  ✓ Scrolling complete!`);
  1107 |       console.log(`  ✓ Total iterations: ${scrollIteration}`);
  1108 |       console.log(`  ✓ Total unique codes found: ${actualCodes.size}`);
  1109 | 
  1110 |       const actualRowCount = actualCodes.size;
  1111 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1112 | 
  1113 |       console.log('\n🔍 Verification Results:');
  1114 | 
  1115 |       // Check if all expected combinations exist
  1116 |       let foundCount = 0;
  1117 |       const missingCombinations: string[] = [];
  1118 | 
  1119 |       for (const expected of expectedCombinations) {
  1120 |         if (actualCodes.has(expected.code)) {
  1121 |           foundCount++;
  1122 |         } else {
  1123 |           missingCombinations.push(expected.code);
  1124 |         }
  1125 |       }
  1126 | 
  1127 |       const allFound = foundCount === expectedCombinations.length;
  1128 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1129 |       console.log(`  ✓ Found: ${foundCount}`);
  1130 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1131 | 
  1132 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1133 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1134 |         missingCombinations.forEach((code, idx) => {
  1135 |           console.log(`    ${idx + 1}. ${code}`);
  1136 |         });
  1137 |       } else if (missingCombinations.length > 10) {
  1138 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1139 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1140 |           console.log(`    ${idx + 1}. ${code}`);
  1141 |         });
  1142 |       }
  1143 | 
  1144 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1145 |       if (allFound) {
  1146 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
  1147 |       } else {
  1148 |         console.log('║ ✗ SOME COMBINATIONS ARE MISSING                           ║');
  1149 |       }
```