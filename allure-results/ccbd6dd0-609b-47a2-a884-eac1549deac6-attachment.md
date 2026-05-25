# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 57. Comprehensive verification of all Semi-Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1292:7

# Error details

```
Error: locator.evaluate: Target page, context or browser has been closed
Call log:
  - waiting for locator('[id*="SemiFinishGoods-innerTable-tableCtrlCnt"]')

```

# Test source

```ts
  945  |       // Find and click the Generate button
  946  |       const generateButton = this.page.locator(
  947  |         'button[id*="SemiFinishGoods::CustomAction::RefreshSemiFinishGoods"]'
  948  |       );
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
  1039 |       console.log(`  (Table uses virtual scrolling - extracting all rendered rows)`);
  1040 | 
  1041 |       // Get the scrollable container (SAP UI5 table structure)
  1042 |       const scrollContainer = this.page.locator('[id*="SemiFinishGoods-innerTable-sapUiTableCtrlScr"]').first();
  1043 | 
  1044 |       // Extract all item codes by scrolling through the table
> 1045 |       const actualCodes: Set<string> = new Set();
       |                            ^ Error: locator.evaluate: Target page, context or browser has been closed
  1046 |       const actualNames: Map<string, string> = new Map();
  1047 | 
  1048 |       // Scroll to top first
  1049 |       await scrollContainer.evaluate(el => {
  1050 |         el.scrollTop = 0;
  1051 |       });
  1052 |       await this.page.waitForTimeout(500);
  1053 | 
  1054 |       // Get the total height to scroll
  1055 |       const scrollHeight = await scrollContainer.evaluate(el => el.scrollHeight);
  1056 |       const viewportHeight = await scrollContainer.evaluate(el => el.clientHeight);
  1057 | 
  1058 |       console.log(`  Table height: ${scrollHeight}px, Viewport: ${viewportHeight}px`);
  1059 | 
  1060 |       // Scroll through entire table
  1061 |       let currentScrollTop = 0;
  1062 |       let previousCodesCount = 0;
  1063 |       let noNewRowsAttempts = 0;
  1064 | 
  1065 |       while (currentScrollTop < scrollHeight && noNewRowsAttempts < 5) {
  1066 |         // Extract all currently visible rows
  1067 |         const tableRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1068 |         const currentRowCount = await tableRows.count();
  1069 | 
  1070 |         console.log(`  Scrolling at ${currentScrollTop}px - Found ${currentRowCount} visible rows`);
  1071 | 
  1072 |         // Extract codes from all visible rows
  1073 |         for (let i = 0; i < currentRowCount; i++) {
  1074 |           const row = tableRows.nth(i);
  1075 |           const cells = row.locator('td[role="gridcell"]');
  1076 | 
  1077 |           const codeCell = cells.nth(0);
  1078 |           const nameCell = cells.nth(1);
  1079 | 
  1080 |           const code = await codeCell.locator('span[class*="sapMText"]').first().textContent();
  1081 |           const name = await nameCell.locator('span[class*="sapMText"]').first().textContent();
  1082 | 
  1083 |           if (code && code.trim()) {
  1084 |             actualCodes.add(code.trim());
  1085 |             if (name && name.trim()) {
  1086 |               actualNames.set(code.trim(), name.trim());
  1087 |             }
  1088 |           }
  1089 |         }
  1090 | 
  1091 |         // Check if we got new codes
  1092 |         if (actualCodes.size === previousCodesCount) {
  1093 |           noNewRowsAttempts++;
  1094 |         } else {
  1095 |           noNewRowsAttempts = 0;
  1096 |           previousCodesCount = actualCodes.size;
  1097 |         }
  1098 | 
  1099 |         // Scroll down to load more rows
  1100 |         currentScrollTop += 300;
  1101 |         await scrollContainer.evaluate((el, pos) => {
  1102 |           el.scrollTop = pos;
  1103 |         }, currentScrollTop);
  1104 |         await this.page.waitForTimeout(400);
  1105 |       }
  1106 | 
  1107 |       console.log(`  ✓ All rows loaded (${actualCodes.size} total unique codes found)`);
  1108 | 
  1109 |       const actualRowCount = actualCodes.size;
  1110 |       console.log(`\n📊 Actual Rows Extracted: ${actualRowCount}`);
  1111 | 
  1112 |       console.log('\n🔍 Verification Results:');
  1113 | 
  1114 |       // Check if all expected combinations exist
  1115 |       let foundCount = 0;
  1116 |       const missingCombinations: string[] = [];
  1117 | 
  1118 |       for (const expected of expectedCombinations) {
  1119 |         if (actualCodes.has(expected.code)) {
  1120 |           foundCount++;
  1121 |         } else {
  1122 |           missingCombinations.push(expected.code);
  1123 |         }
  1124 |       }
  1125 | 
  1126 |       const allFound = foundCount === expectedCombinations.length;
  1127 |       console.log(`  ✓ Expected: ${expectedCombinations.length}`);
  1128 |       console.log(`  ✓ Found: ${foundCount}`);
  1129 |       console.log(`  ${allFound ? '✓' : '✗'} Match: ${allFound ? 'YES' : 'NO'}`);
  1130 | 
  1131 |       if (missingCombinations.length > 0 && missingCombinations.length <= 10) {
  1132 |         console.log(`\n  Missing combinations (${missingCombinations.length}):`);
  1133 |         missingCombinations.forEach((code, idx) => {
  1134 |           console.log(`    ${idx + 1}. ${code}`);
  1135 |         });
  1136 |       } else if (missingCombinations.length > 10) {
  1137 |         console.log(`\n  Missing ${missingCombinations.length} combinations (showing first 5):`);
  1138 |         missingCombinations.slice(0, 5).forEach((code, idx) => {
  1139 |           console.log(`    ${idx + 1}. ${code}`);
  1140 |         });
  1141 |       }
  1142 | 
  1143 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1144 |       if (allFound) {
  1145 |         console.log('║ ✓ ALL COMBINATIONS VERIFIED SUCCESSFULLY                  ║');
```