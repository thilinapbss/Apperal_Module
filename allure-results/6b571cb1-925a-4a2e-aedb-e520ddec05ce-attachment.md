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
  1756 |       // Fill Item Name
  1757 |       await itemNameInput.click({ timeout: 5000 });
  1758 |       await itemNameInput.clear();
  1759 |       await itemNameInput.fill(itemName);
  1760 |       console.log(`    ✓ Item Name entered: ${itemName}`);
  1761 |       await this.page.waitForTimeout(300);
  1762 | 
  1763 |       // Verify values were entered
  1764 |       const codeValue = await itemCodeInput.inputValue();
  1765 |       const nameValue = await itemNameInput.inputValue();
  1766 | 
  1767 |       if (codeValue === itemCode && nameValue === itemName) {
  1768 |         console.log(`    ✓ Row data verified and saved`);
  1769 |         return true;
  1770 |       } else {
  1771 |         console.log(`    ⚠️  Values not saved properly`);
  1772 |         return false;
  1773 |       }
  1774 |     } catch (e) {
  1775 |       console.error(`    ✗ Failed to fill Raw Material row: ${e}`);
  1776 |       return false;
  1777 |     }
  1778 |   }
  1779 | 
  1780 |   async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
  1781 |     try {
  1782 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1783 |       console.log('║           ADDING RAW MATERIALS                            ║');
  1784 |       console.log('║         (New rows added to table TOP)                     ║');
  1785 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1786 | 
  1787 |       // Scroll to Raw Materials section
  1788 |       await this.scrollToRawMaterialsSection();
  1789 | 
  1790 |       // Wait for section to be visible
  1791 |       await this.waitForRawMaterialsSection();
  1792 | 
  1793 |       let successCount = 0;
  1794 | 
  1795 |       for (let i = 0; i < rawMaterials.length; i++) {
  1796 |         try {
  1797 |           console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);
  1798 | 
  1799 |           // Click Create button to add new row
  1800 |           await this.clickRawMaterialsCreateButton();
  1801 | 
  1802 |           // Wait for new row to appear
  1803 |           await this.waitForRawMaterialsTableRow();
  1804 | 
  1805 |           // Fill the newly created row
  1806 |           const success = await this.fillRawMaterialRow(
  1807 |             rawMaterials[i].itemCode,
  1808 |             rawMaterials[i].itemName
  1809 |           );
  1810 | 
  1811 |           if (success) {
  1812 |             console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
  1813 |             successCount++;
  1814 |           } else {
  1815 |             console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
  1816 |           }
  1817 |         } catch (e) {
  1818 |           console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
  1819 |         }
  1820 |       }
  1821 | 
  1822 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1823 |       console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
  1824 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1825 | 
  1826 |       return {
  1827 |         successCount,
  1828 |         totalRows: rawMaterials.length,
  1829 |         allAdded: successCount === rawMaterials.length
  1830 |       };
  1831 |     } catch (e) {
  1832 |       console.error('\n✗ Failed to add Raw Materials:');
  1833 |       console.error(e);
  1834 |       throw e;
  1835 |     }
  1836 |   }
  1837 | 
  1838 |   // Allocation Hierarchy Methods
  1839 | 
  1840 |   async scrollToAllocationHierarchySection() {
  1841 |     try {
  1842 |       await this.page.evaluate(() => {
  1843 |         const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
  1844 |         if (allocationSection) {
  1845 |           allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1846 |         }
  1847 |       });
  1848 |       await this.page.waitForTimeout(800);
  1849 |       console.log('  ✓ Scrolled to Allocation Hierarchy section');
  1850 |     } catch (e) {
  1851 |       console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
  1852 |     }
  1853 |   }
  1854 | 
  1855 |   async waitForAllocationHierarchySection() {
> 1856 |     await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1857 |     console.log('  ✓ Allocation Hierarchy section is visible');
  1858 |   }
  1859 | 
  1860 |   async expandTreeNode(rowIndex: number) {
  1861 |     try {
  1862 |       const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1863 |       const row = allRows.nth(rowIndex);
  1864 | 
  1865 |       // Find the tree icon (expand/collapse button)
  1866 |       const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
  1867 |       const isExpandable = await treeIcon.evaluate((el) => {
  1868 |         return el.classList.contains('sapUiTableTreeIconNodeClosed');
  1869 |       });
  1870 | 
  1871 |       if (isExpandable) {
  1872 |         await treeIcon.click();
  1873 |         await this.page.waitForTimeout(500);
  1874 |         console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
  1875 |         return true;
  1876 |       } else {
  1877 |         console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
  1878 |         return false;
  1879 |       }
  1880 |     } catch (e) {
  1881 |       console.error(`    ✗ Failed to expand node: ${e}`);
  1882 |       return false;
  1883 |     }
  1884 |   }
  1885 | 
  1886 |   async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
  1887 |     try {
  1888 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1889 |       console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
  1890 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1891 | 
  1892 |       // Scroll to section
  1893 |       await this.scrollToAllocationHierarchySection();
  1894 |       await this.waitForAllocationHierarchySection();
  1895 | 
  1896 |       let successCount = 0;
  1897 | 
  1898 |       for (const allocation of allocations) {
  1899 |         try {
  1900 |           const rowIndex = allocation.rowIndex;
  1901 |           const quantity = allocation.quantity;
  1902 | 
  1903 |           console.log(`  ╔═════════════════════════════════════════════════════╗`);
  1904 |           console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
  1905 |           console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1906 | 
  1907 |           // Get fresh row reference
  1908 |           const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1909 |           const currentRow = allRows.nth(rowIndex);
  1910 | 
  1911 |           // Get the quantity input field (second column)
  1912 |           const quantityInput = currentRow
  1913 |             .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
  1914 |             .first()
  1915 |             .locator('input[type="text"]')
  1916 |             .first();
  1917 | 
  1918 |           // Scroll row into view
  1919 |           await currentRow.scrollIntoViewIfNeeded();
  1920 |           await this.page.waitForTimeout(300);
  1921 | 
  1922 |           // Check if input exists
  1923 |           const inputExists = await quantityInput.count();
  1924 |           if (inputExists === 0) {
  1925 |             console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
  1926 |             continue;
  1927 |           }
  1928 | 
  1929 |           // Wait for input to be visible
  1930 |           await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  1931 | 
  1932 |           // Click and fill the input
  1933 |           await quantityInput.click();
  1934 |           await this.page.waitForTimeout(150);
  1935 |           await quantityInput.fill(quantity);
  1936 |           console.log(`    ✓ Quantity filled: ${quantity}`);
  1937 | 
  1938 |           // Press Tab to confirm
  1939 |           await this.page.keyboard.press('Tab');
  1940 |           await this.page.waitForLoadState('networkidle');
  1941 |           await this.page.waitForTimeout(500);
  1942 | 
  1943 |           // Verify the value was saved
  1944 |           const savedValue = await quantityInput.inputValue();
  1945 |           if (savedValue === quantity) {
  1946 |             console.log(`    ✓ Value verified: ${savedValue}`);
  1947 |             successCount++;
  1948 |           } else {
  1949 |             console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
  1950 |           }
  1951 |         } catch (e) {
  1952 |           console.error(`  ✗ Error processing allocation: ${e}`);
  1953 |         }
  1954 |       }
  1955 | 
  1956 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
```