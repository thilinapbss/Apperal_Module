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
  1834 |       console.log(`    → Filling Item Name...`);
  1835 |       await itemNameInput.click();
  1836 |       await this.page.waitForTimeout(200);
  1837 |       await itemNameInput.fill(itemName);
  1838 |       console.log(`      ✓ Name: ${itemName}`);
  1839 |       await this.page.waitForTimeout(400);
  1840 | 
  1841 |       // Verify
  1842 |       const codeVal = await itemCodeInput.inputValue();
  1843 |       const nameVal = await itemNameInput.inputValue();
  1844 | 
  1845 |       console.log(`    → Verification:`);
  1846 |       console.log(`      Code in field: '${codeVal}'`);
  1847 |       console.log(`      Name in field: '${nameVal}'`);
  1848 | 
  1849 |       if (codeVal === itemCode && nameVal === itemName) {
  1850 |         console.log(`    ✓ Confirmed: Both fields filled correctly`);
  1851 |         return true;
  1852 |       } else {
  1853 |         console.log(`    ⚠️  Mismatch in values`);
  1854 |         return false;
  1855 |       }
  1856 |     } catch (e) {
  1857 |       console.error(`    ✗ Error: ${String(e).substring(0, 100)}`);
  1858 |       return false;
  1859 |     }
  1860 |   }
  1861 | 
  1862 |   async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
  1863 |     try {
  1864 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1865 |       console.log('║           ADDING RAW MATERIALS                            ║');
  1866 |       console.log('║         (New rows added to table TOP)                     ║');
  1867 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1868 | 
  1869 |       // Scroll to Raw Materials section
  1870 |       await this.scrollToRawMaterialsSection();
  1871 | 
  1872 |       // Wait for create button to be available
  1873 |       await this.rawMaterialsCreateButton.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {
  1874 |         console.log('  ⚠️  Create button not found, proceeding anyway');
  1875 |       });
  1876 | 
  1877 |       let successCount = 0;
  1878 | 
  1879 |       for (let i = 0; i < rawMaterials.length; i++) {
  1880 |         try {
  1881 |           console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);
  1882 | 
  1883 |           // Click Create button to add new row
  1884 |           await this.clickRawMaterialsCreateButton();
  1885 | 
  1886 |           // Wait for new row to appear
  1887 |           await this.waitForRawMaterialsTableRow();
  1888 | 
  1889 |           // Fill the newly created row
  1890 |           const success = await this.fillRawMaterialRow(
  1891 |             rawMaterials[i].itemCode,
  1892 |             rawMaterials[i].itemName
  1893 |           );
  1894 | 
  1895 |           if (success) {
  1896 |             console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
  1897 |             successCount++;
  1898 |           } else {
  1899 |             console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
  1900 |           }
  1901 |         } catch (e) {
  1902 |           console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
  1903 |         }
  1904 |       }
  1905 | 
  1906 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1907 |       console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
  1908 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1909 | 
  1910 |       return {
  1911 |         successCount,
  1912 |         totalRows: rawMaterials.length,
  1913 |         allAdded: successCount === rawMaterials.length
  1914 |       };
  1915 |     } catch (e) {
  1916 |       console.error('\n✗ Failed to add Raw Materials:');
  1917 |       console.error(e);
  1918 |       throw e;
  1919 |     }
  1920 |   }
  1921 | 
  1922 |   // Allocation Hierarchy Methods
  1923 | 
  1924 |   async scrollToAllocationHierarchySection() {
  1925 |     try {
  1926 |       await this.page.evaluate(() => {
  1927 |         const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
  1928 |         if (allocationSection) {
  1929 |           allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1930 |         }
  1931 |       });
  1932 |       await this.page.waitForTimeout(800);
  1933 |       console.log('  ✓ Scrolled to Allocation Hierarchy section');
> 1934 |     } catch (e) {
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1935 |       console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
  1936 |     }
  1937 |   }
  1938 | 
  1939 |   async waitForAllocationHierarchySection() {
  1940 |     await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
  1941 |     console.log('  ✓ Allocation Hierarchy section is visible');
  1942 |   }
  1943 | 
  1944 |   async expandTreeNode(rowIndex: number) {
  1945 |     try {
  1946 |       const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1947 |       const row = allRows.nth(rowIndex);
  1948 | 
  1949 |       // Find the tree icon (expand/collapse button)
  1950 |       const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
  1951 |       const isExpandable = await treeIcon.evaluate((el) => {
  1952 |         return el.classList.contains('sapUiTableTreeIconNodeClosed');
  1953 |       });
  1954 | 
  1955 |       if (isExpandable) {
  1956 |         await treeIcon.click();
  1957 |         await this.page.waitForTimeout(500);
  1958 |         console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
  1959 |         return true;
  1960 |       } else {
  1961 |         console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
  1962 |         return false;
  1963 |       }
  1964 |     } catch (e) {
  1965 |       console.error(`    ✗ Failed to expand node: ${e}`);
  1966 |       return false;
  1967 |     }
  1968 |   }
  1969 | 
  1970 |   async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
  1971 |     try {
  1972 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1973 |       console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
  1974 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1975 | 
  1976 |       // Scroll to section
  1977 |       await this.scrollToAllocationHierarchySection();
  1978 |       await this.waitForAllocationHierarchySection();
  1979 | 
  1980 |       let successCount = 0;
  1981 | 
  1982 |       for (const allocation of allocations) {
  1983 |         try {
  1984 |           const rowIndex = allocation.rowIndex;
  1985 |           const quantity = allocation.quantity;
  1986 | 
  1987 |           console.log(`  ╔═════════════════════════════════════════════════════╗`);
  1988 |           console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
  1989 |           console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1990 | 
  1991 |           // Get fresh row reference
  1992 |           const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1993 |           const currentRow = allRows.nth(rowIndex);
  1994 | 
  1995 |           // Get the quantity input field (second column)
  1996 |           const quantityInput = currentRow
  1997 |             .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
  1998 |             .first()
  1999 |             .locator('input[type="text"]')
  2000 |             .first();
  2001 | 
  2002 |           // Scroll row into view
  2003 |           await currentRow.scrollIntoViewIfNeeded();
  2004 |           await this.page.waitForTimeout(300);
  2005 | 
  2006 |           // Check if input exists
  2007 |           const inputExists = await quantityInput.count();
  2008 |           if (inputExists === 0) {
  2009 |             console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
  2010 |             continue;
  2011 |           }
  2012 | 
  2013 |           // Wait for input to be visible
  2014 |           await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  2015 | 
  2016 |           // Click and fill the input
  2017 |           await quantityInput.click();
  2018 |           await this.page.waitForTimeout(150);
  2019 |           await quantityInput.fill(quantity);
  2020 |           console.log(`    ✓ Quantity filled: ${quantity}`);
  2021 | 
  2022 |           // Press Tab to confirm
  2023 |           await this.page.keyboard.press('Tab');
  2024 |           await this.page.waitForLoadState('networkidle');
  2025 |           await this.page.waitForTimeout(500);
  2026 | 
  2027 |           // Verify the value was saved
  2028 |           const savedValue = await quantityInput.inputValue();
  2029 |           if (savedValue === quantity) {
  2030 |             console.log(`    ✓ Value verified: ${savedValue}`);
  2031 |             successCount++;
  2032 |           } else {
  2033 |             console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
  2034 |           }
```