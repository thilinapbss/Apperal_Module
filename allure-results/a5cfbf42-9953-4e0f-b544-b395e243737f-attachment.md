# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53c. Click Generate button in Semi-Finish Goods
- Location: e2e\apparel_regression_testing.spec.ts:1068:7

# Error details

```
Error: Semi-Finish Goods Generate button not found
```

# Test source

```ts
  852  |       const segmentPosition = segmentPositions[i];
  853  | 
  854  |       if (segmentData && Array.isArray(segmentData) && segmentData.length > 0) {
  855  |         const values = segmentData[0].values;
  856  | 
  857  |         if (values && values.length > 0) {
  858  |           console.log(`\n┌─ POSITION: ${segmentPosition} ← ${segmentType.toUpperCase()}`);
  859  |           console.log(`│  Values to fill: ${values.length}`);
  860  | 
  861  |           try {
  862  |             // Fill each value - click Create for each row
  863  |             let successCount = 0;
  864  |             for (let j = 0; j < values.length; j++) {
  865  |               // Click Create button before filling each row
  866  |               console.log(`│  Clicking Create button for row ${j + 1}...`);
  867  |               await this.clickSegmentCreateButton(segmentPosition);
  868  |               console.log(`│  ✓ Create button clicked`);
  869  | 
  870  |               // Fill the newly created row
  871  |               const success = await this.fillSegmentValueInRow(
  872  |                 segmentPosition,
  873  |                 values[j].code,
  874  |                 values[j].name
  875  |               );
  876  | 
  877  |               if (success) {
  878  |                 console.log(`│    ✓ Row ${j + 1}: [${values[j].code}] = ${values[j].name}`);
  879  |                 successCount++;
  880  |               } else {
  881  |                 console.log(`│    ✗ Row ${j + 1}: Failed to fill`);
  882  |               }
  883  | 
  884  |               // Wait before next row
  885  |               if (j < values.length - 1) {
  886  |                 await this.page.waitForTimeout(300);
  887  |               }
  888  |             }
  889  | 
  890  |             const allSuccess = successCount === values.length;
  891  |             results[segmentType] = allSuccess;
  892  |             console.log(`│  Status: ${allSuccess ? '✓ COMPLETED' : '✗ PARTIAL'} (${successCount}/${values.length})`);
  893  |             console.log(`└─────────────────────────────────────────────────────`);
  894  | 
  895  |             // Wait before processing next segment
  896  |             await this.page.waitForTimeout(500);
  897  |           } catch (e) {
  898  |             console.error(`│  ✗ Error: ${e}`);
  899  |             results[segmentType] = false;
  900  |             console.log(`└─────────────────────────────────────────────────────`);
  901  |           }
  902  |         }
  903  |       }
  904  |     }
  905  | 
  906  |     // Summary
  907  |     console.log('\n╔════════════════════════════════════════════════════════════╗');
  908  |     console.log('║          SEGMENT FILL BY POSITION - SUMMARY                ║');
  909  |     console.log('╠════════════════════════════════════════════════════════════╣');
  910  | 
  911  |     for (const [segmentType, success] of Object.entries(results)) {
  912  |       const status = success ? '✓' : '✗';
  913  |       console.log(`║ ${status} ${segmentType.padEnd(10)} filled successfully`);
  914  |     }
  915  | 
  916  |     const totalSegments = Object.keys(results).length;
  917  |     const successCount = Object.values(results).filter(r => r).length;
  918  |     console.log('╠════════════════════════════════════════════════════════════╣');
  919  |     console.log(`║ Total: ${successCount}/${totalSegments} segments filled`);
  920  |     console.log('╚════════════════════════════════════════════════════════════╝\n');
  921  | 
  922  |     return {
  923  |       totalSegments,
  924  |       successCount,
  925  |       results
  926  |     };
  927  |   }
  928  | 
  929  |   async clickSemiFinishGoodsGenerateButton() {
  930  |     try {
  931  |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  932  |       console.log('║         CLICKING SEMI-FINISH GOODS GENERATE BUTTON         ║');
  933  |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  934  | 
  935  |       // Scroll to Semi-Finish Goods section
  936  |       console.log('  Scrolling to Semi-Finish Goods section...');
  937  |       await this.page.evaluate(() => {
  938  |         const semiFinishGoodsSection = document.querySelector('[id*="SemiFinishGoods"]');
  939  |         if (semiFinishGoodsSection) {
  940  |           semiFinishGoodsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  941  |         }
  942  |       });
  943  |       await this.page.waitForTimeout(1000);
  944  | 
  945  |       // Find and click the Generate button
  946  |       const generateButton = this.page.locator(
  947  |         'button[id*="SemiFinishGoods::CustomAction::RefreshSemiFinishGoods"]'
  948  |       );
  949  | 
  950  |       const count = await generateButton.count();
  951  |       if (count === 0) {
> 952  |         throw new Error('Semi-Finish Goods Generate button not found');
       |               ^ Error: Semi-Finish Goods Generate button not found
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
  1047 |       await firstCell.click();
  1048 |       await this.page.waitForTimeout(300);
  1049 | 
  1050 |       console.log(`  ✓ Table focused`);
  1051 | 
  1052 |       // Press Ctrl+End to go to the last row to load all rows
```