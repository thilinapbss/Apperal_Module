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
  1739 |       await this.page.keyboard.press('Tab');
  1740 |       await this.page.waitForTimeout(300);
  1741 | 
  1742 |       // Fill Item Name (second input)
  1743 |       const itemNameInput = inputs.nth(1);
  1744 |       await itemNameInput.waitFor({ state: 'visible', timeout: 5000 });
  1745 |       await itemNameInput.click();
  1746 |       await itemNameInput.clear();
  1747 |       await itemNameInput.fill(itemName);
  1748 |       console.log(`    ✓ Item Name filled: ${itemName}`);
  1749 | 
  1750 |       await this.page.keyboard.press('Tab');
  1751 |       await this.page.waitForLoadState('networkidle');
  1752 |       await this.page.waitForTimeout(500);
  1753 | 
  1754 |       return true;
  1755 |     } catch (e) {
  1756 |       console.error(`    ✗ Failed to fill Raw Material row: ${e}`);
  1757 |       return false;
  1758 |     }
  1759 |   }
  1760 | 
  1761 |   async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
  1762 |     try {
  1763 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1764 |       console.log('║           ADDING RAW MATERIALS                            ║');
  1765 |       console.log('║         (New rows added to table TOP)                     ║');
  1766 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1767 | 
  1768 |       // Scroll to Raw Materials section
  1769 |       await this.scrollToRawMaterialsSection();
  1770 | 
  1771 |       // Wait for section to be visible
  1772 |       await this.waitForRawMaterialsSection();
  1773 | 
  1774 |       let successCount = 0;
  1775 | 
  1776 |       for (let i = 0; i < rawMaterials.length; i++) {
  1777 |         try {
  1778 |           console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);
  1779 | 
  1780 |           // Click Create button to add new row
  1781 |           await this.clickRawMaterialsCreateButton();
  1782 | 
  1783 |           // Wait for new row to appear
  1784 |           await this.waitForRawMaterialsTableRow();
  1785 | 
  1786 |           // Fill the newly created row at the TOP (index 0)
  1787 |           const success = await this.fillRawMaterialRow(
  1788 |             0, // rowIndex not used when fillFirstRow is true
  1789 |             rawMaterials[i].itemCode,
  1790 |             rawMaterials[i].itemName,
  1791 |             true // fillFirstRow = true (always fill the first row which is newly created at top)
  1792 |           );
  1793 | 
  1794 |           if (success) {
  1795 |             console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
  1796 |             successCount++;
  1797 |           } else {
  1798 |             console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
  1799 |           }
  1800 |         } catch (e) {
  1801 |           console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
  1802 |         }
  1803 |       }
  1804 | 
  1805 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1806 |       console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
  1807 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1808 | 
  1809 |       return {
  1810 |         successCount,
  1811 |         totalRows: rawMaterials.length,
  1812 |         allAdded: successCount === rawMaterials.length
  1813 |       };
  1814 |     } catch (e) {
  1815 |       console.error('\n✗ Failed to add Raw Materials:');
  1816 |       console.error(e);
  1817 |       throw e;
  1818 |     }
  1819 |   }
  1820 | 
  1821 |   // Allocation Hierarchy Methods
  1822 | 
  1823 |   async scrollToAllocationHierarchySection() {
  1824 |     try {
  1825 |       await this.page.evaluate(() => {
  1826 |         const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
  1827 |         if (allocationSection) {
  1828 |           allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1829 |         }
  1830 |       });
  1831 |       await this.page.waitForTimeout(800);
  1832 |       console.log('  ✓ Scrolled to Allocation Hierarchy section');
  1833 |     } catch (e) {
  1834 |       console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
  1835 |     }
  1836 |   }
  1837 | 
  1838 |   async waitForAllocationHierarchySection() {
> 1839 |     await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1840 |     console.log('  ✓ Allocation Hierarchy section is visible');
  1841 |   }
  1842 | 
  1843 |   async expandTreeNode(rowIndex: number) {
  1844 |     try {
  1845 |       const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1846 |       const row = allRows.nth(rowIndex);
  1847 | 
  1848 |       // Find the tree icon (expand/collapse button)
  1849 |       const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
  1850 |       const isExpandable = await treeIcon.evaluate((el) => {
  1851 |         return el.classList.contains('sapUiTableTreeIconNodeClosed');
  1852 |       });
  1853 | 
  1854 |       if (isExpandable) {
  1855 |         await treeIcon.click();
  1856 |         await this.page.waitForTimeout(500);
  1857 |         console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
  1858 |         return true;
  1859 |       } else {
  1860 |         console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
  1861 |         return false;
  1862 |       }
  1863 |     } catch (e) {
  1864 |       console.error(`    ✗ Failed to expand node: ${e}`);
  1865 |       return false;
  1866 |     }
  1867 |   }
  1868 | 
  1869 |   async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
  1870 |     try {
  1871 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1872 |       console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
  1873 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1874 | 
  1875 |       // Scroll to section
  1876 |       await this.scrollToAllocationHierarchySection();
  1877 |       await this.waitForAllocationHierarchySection();
  1878 | 
  1879 |       let successCount = 0;
  1880 | 
  1881 |       for (const allocation of allocations) {
  1882 |         try {
  1883 |           const rowIndex = allocation.rowIndex;
  1884 |           const quantity = allocation.quantity;
  1885 | 
  1886 |           console.log(`  ╔═════════════════════════════════════════════════════╗`);
  1887 |           console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
  1888 |           console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1889 | 
  1890 |           // Get fresh row reference
  1891 |           const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1892 |           const currentRow = allRows.nth(rowIndex);
  1893 | 
  1894 |           // Get the quantity input field (second column)
  1895 |           const quantityInput = currentRow
  1896 |             .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
  1897 |             .first()
  1898 |             .locator('input[type="text"]')
  1899 |             .first();
  1900 | 
  1901 |           // Scroll row into view
  1902 |           await currentRow.scrollIntoViewIfNeeded();
  1903 |           await this.page.waitForTimeout(300);
  1904 | 
  1905 |           // Check if input exists
  1906 |           const inputExists = await quantityInput.count();
  1907 |           if (inputExists === 0) {
  1908 |             console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
  1909 |             continue;
  1910 |           }
  1911 | 
  1912 |           // Wait for input to be visible
  1913 |           await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  1914 | 
  1915 |           // Click and fill the input
  1916 |           await quantityInput.click();
  1917 |           await this.page.waitForTimeout(150);
  1918 |           await quantityInput.fill(quantity);
  1919 |           console.log(`    ✓ Quantity filled: ${quantity}`);
  1920 | 
  1921 |           // Press Tab to confirm
  1922 |           await this.page.keyboard.press('Tab');
  1923 |           await this.page.waitForLoadState('networkidle');
  1924 |           await this.page.waitForTimeout(500);
  1925 | 
  1926 |           // Verify the value was saved
  1927 |           const savedValue = await quantityInput.inputValue();
  1928 |           if (savedValue === quantity) {
  1929 |             console.log(`    ✓ Value verified: ${savedValue}`);
  1930 |             successCount++;
  1931 |           } else {
  1932 |             console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
  1933 |           }
  1934 |         } catch (e) {
  1935 |           console.error(`  ✗ Error processing allocation: ${e}`);
  1936 |         }
  1937 |       }
  1938 | 
  1939 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
```