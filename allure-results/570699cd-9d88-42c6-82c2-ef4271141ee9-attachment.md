# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 57. Comprehensive verification of all Semi-Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1359:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first()

```

# Test source

```ts
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
  1039 |       console.log(`  (Using keyboard navigation to load all rows)`);
  1040 | 
  1041 |       // Extract all item codes using keyboard navigation
  1042 |       const actualCodes: Set<string> = new Set();
  1043 |       const actualNames: Map<string, string> = new Map();
  1044 | 
  1045 |       // Click on the first cell of the table to focus it
  1046 |       const firstCell = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex="0"] td[data-sap-ui-colid*="ItemCode"]').first();
> 1047 |       await firstCell.click();
       |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  1048 |       await this.page.waitForTimeout(300);
  1049 | 
  1050 |       console.log(`  ✓ Table focused`);
  1051 | 
  1052 |       // Press Ctrl+End to go to the last row to load all rows
  1053 |       await this.page.keyboard.press('Control+End');
  1054 |       await this.page.waitForTimeout(1000);
  1055 | 
  1056 |       console.log(`  ✓ Navigated to end of table`);
  1057 | 
  1058 |       // Now go back to the beginning
  1059 |       await this.page.keyboard.press('Control+Home');
  1060 |       await this.page.waitForTimeout(500);
  1061 | 
  1062 |       console.log(`  ✓ Back at beginning of table`);
  1063 | 
  1064 |       // Extract all currently rendered rows
  1065 |       const tableRows = this.page.locator('table[id*="SemiFinishGoods-innerTable-table"] tbody tr[data-sap-ui-rowindex]');
  1066 |       const totalTableRows = await tableRows.count();
  1067 | 
  1068 |       console.log(`  ✓ Total table rows found in DOM: ${totalTableRows}`);
  1069 | 
  1070 |       // Extract from all visible rows
  1071 |       for (let i = 0; i < totalTableRows; i++) {
  1072 |         const row = tableRows.nth(i);
  1073 |         const cells = row.locator('td[role="gridcell"]');
  1074 | 
  1075 |         const codeCell = cells.nth(0);
  1076 |         const nameCell = cells.nth(1);
  1077 | 
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
```