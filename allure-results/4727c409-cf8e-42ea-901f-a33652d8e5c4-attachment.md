# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 55. Fill Allocation Hierarchy Quantities
- Location: e2e\apparel_regression_testing.spec.ts:1253:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('section[id*="StyleTreeTable"]') to be visible

```

# Test source

```ts
  1884 | 
  1885 |       // Verify
  1886 |       const codeVal = await itemCodeInput.inputValue();
  1887 |       const nameVal = await itemNameInput.inputValue();
  1888 | 
  1889 |       console.log(`    → Verification:`);
  1890 |       console.log(`      Code in field: '${codeVal}'`);
  1891 |       console.log(`      Name in field: '${nameVal}'`);
  1892 | 
  1893 |       if (codeVal === itemCode && nameVal === itemName) {
  1894 |         console.log(`    ✓ Confirmed: Both fields filled correctly`);
  1895 |         return true;
  1896 |       } else {
  1897 |         console.log(`    ⚠️  Mismatch in values`);
  1898 |         return false;
  1899 |       }
  1900 |     } catch (e) {
  1901 |       console.error(`    ✗ Error: ${String(e).substring(0, 100)}`);
  1902 |       return false;
  1903 |     }
  1904 |   }
  1905 | 
  1906 |   async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
  1907 |     try {
  1908 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1909 |       console.log('║           ADDING RAW MATERIALS                            ║');
  1910 |       console.log('║         (New rows added to table TOP)                     ║');
  1911 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1912 | 
  1913 |       // Scroll to Raw Materials section
  1914 |       await this.scrollToRawMaterialsSection();
  1915 | 
  1916 |       // Wait for create button to be available
  1917 |       await this.rawMaterialsCreateButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
  1918 |         console.log('  ⚠️  Create button not found, proceeding anyway');
  1919 |       });
  1920 | 
  1921 |       let successCount = 0;
  1922 | 
  1923 |       for (let i = 0; i < rawMaterials.length; i++) {
  1924 |         try {
  1925 |           console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);
  1926 | 
  1927 |           // Click Create button to add new row
  1928 |           await this.clickRawMaterialsCreateButton();
  1929 | 
  1930 |           // Wait for new row to appear
  1931 |           await this.waitForRawMaterialsTableRow();
  1932 | 
  1933 |           // Fill the newly created row
  1934 |           const success = await this.fillRawMaterialRow(
  1935 |             rawMaterials[i].itemCode,
  1936 |             rawMaterials[i].itemName
  1937 |           );
  1938 | 
  1939 |           if (success) {
  1940 |             console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
  1941 |             successCount++;
  1942 |           } else {
  1943 |             console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
  1944 |           }
  1945 |         } catch (e) {
  1946 |           console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
  1947 |         }
  1948 |       }
  1949 | 
  1950 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1951 |       console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
  1952 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1953 | 
  1954 |       return {
  1955 |         successCount,
  1956 |         totalRows: rawMaterials.length,
  1957 |         allAdded: successCount === rawMaterials.length
  1958 |       };
  1959 |     } catch (e) {
  1960 |       console.error('\n✗ Failed to add Raw Materials:');
  1961 |       console.error(e);
  1962 |       throw e;
  1963 |     }
  1964 |   }
  1965 | 
  1966 |   // Allocation Hierarchy Methods
  1967 | 
  1968 |   async scrollToAllocationHierarchySection() {
  1969 |     try {
  1970 |       await this.page.evaluate(() => {
  1971 |         const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
  1972 |         if (allocationSection) {
  1973 |           allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1974 |         }
  1975 |       });
  1976 |       await this.page.waitForTimeout(800);
  1977 |       console.log('  ✓ Scrolled to Allocation Hierarchy section');
  1978 |     } catch (e) {
  1979 |       console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
  1980 |     }
  1981 |   }
  1982 | 
  1983 |   async waitForAllocationHierarchySection() {
> 1984 |     await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1985 |     console.log('  ✓ Allocation Hierarchy section is visible');
  1986 |   }
  1987 | 
  1988 |   async expandTreeNode(rowIndex: number) {
  1989 |     try {
  1990 |       const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1991 |       const row = allRows.nth(rowIndex);
  1992 | 
  1993 |       // Find the tree icon (expand/collapse button)
  1994 |       const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
  1995 |       const isExpandable = await treeIcon.evaluate((el) => {
  1996 |         return el.classList.contains('sapUiTableTreeIconNodeClosed');
  1997 |       });
  1998 | 
  1999 |       if (isExpandable) {
  2000 |         await treeIcon.click();
  2001 |         await this.page.waitForTimeout(500);
  2002 |         console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
  2003 |         return true;
  2004 |       } else {
  2005 |         console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
  2006 |         return false;
  2007 |       }
  2008 |     } catch (e) {
  2009 |       console.error(`    ✗ Failed to expand node: ${e}`);
  2010 |       return false;
  2011 |     }
  2012 |   }
  2013 | 
  2014 |   async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
  2015 |     try {
  2016 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  2017 |       console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
  2018 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  2019 | 
  2020 |       // Scroll to section
  2021 |       await this.scrollToAllocationHierarchySection();
  2022 |       await this.waitForAllocationHierarchySection();
  2023 | 
  2024 |       let successCount = 0;
  2025 | 
  2026 |       for (const allocation of allocations) {
  2027 |         try {
  2028 |           const rowIndex = allocation.rowIndex;
  2029 |           const quantity = allocation.quantity;
  2030 | 
  2031 |           console.log(`  ╔═════════════════════════════════════════════════════╗`);
  2032 |           console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
  2033 |           console.log(`  ╚═════════════════════════════════════════════════════╝`);
  2034 | 
  2035 |           // Get fresh row reference
  2036 |           const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  2037 |           const currentRow = allRows.nth(rowIndex);
  2038 | 
  2039 |           // Get the quantity input field (second column)
  2040 |           const quantityInput = currentRow
  2041 |             .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
  2042 |             .first()
  2043 |             .locator('input[type="text"]')
  2044 |             .first();
  2045 | 
  2046 |           // Scroll row into view
  2047 |           await currentRow.scrollIntoViewIfNeeded();
  2048 |           await this.page.waitForTimeout(300);
  2049 | 
  2050 |           // Check if input exists
  2051 |           const inputExists = await quantityInput.count();
  2052 |           if (inputExists === 0) {
  2053 |             console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
  2054 |             continue;
  2055 |           }
  2056 | 
  2057 |           // Wait for input to be visible
  2058 |           await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  2059 | 
  2060 |           // Click and fill the input
  2061 |           await quantityInput.click();
  2062 |           await this.page.waitForTimeout(150);
  2063 |           await quantityInput.fill(quantity);
  2064 |           console.log(`    ✓ Quantity filled: ${quantity}`);
  2065 | 
  2066 |           // Press Tab to confirm
  2067 |           await this.page.keyboard.press('Tab');
  2068 |           await this.page.waitForLoadState('networkidle');
  2069 |           await this.page.waitForTimeout(500);
  2070 | 
  2071 |           // Verify the value was saved
  2072 |           const savedValue = await quantityInput.inputValue();
  2073 |           if (savedValue === quantity) {
  2074 |             console.log(`    ✓ Value verified: ${savedValue}`);
  2075 |             successCount++;
  2076 |           } else {
  2077 |             console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
  2078 |           }
  2079 |         } catch (e) {
  2080 |           console.error(`  ✗ Error processing allocation: ${e}`);
  2081 |         }
  2082 |       }
  2083 | 
  2084 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
```