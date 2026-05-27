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
  1724 |       await this.page.keyboard.press('Tab');
  1725 |       await this.page.waitForTimeout(300);
  1726 | 
  1727 |       // Fill Item Name (second input)
  1728 |       const itemNameInput = inputs.nth(1);
  1729 |       await itemNameInput.waitFor({ state: 'visible', timeout: 5000 });
  1730 |       await itemNameInput.click();
  1731 |       await itemNameInput.clear();
  1732 |       await itemNameInput.fill(itemName);
  1733 |       console.log(`    ✓ Item Name filled: ${itemName}`);
  1734 | 
  1735 |       await this.page.keyboard.press('Tab');
  1736 |       await this.page.waitForLoadState('networkidle');
  1737 |       await this.page.waitForTimeout(500);
  1738 | 
  1739 |       return true;
  1740 |     } catch (e) {
  1741 |       console.error(`    ✗ Failed to fill Raw Material row: ${e}`);
  1742 |       return false;
  1743 |     }
  1744 |   }
  1745 | 
  1746 |   async addRawMaterials(rawMaterials: Array<{ itemCode: string; itemName: string }>) {
  1747 |     try {
  1748 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1749 |       console.log('║           ADDING RAW MATERIALS                            ║');
  1750 |       console.log('║         (New rows added to table TOP)                     ║');
  1751 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1752 | 
  1753 |       // Scroll to Raw Materials section
  1754 |       await this.scrollToRawMaterialsSection();
  1755 | 
  1756 |       // Wait for section to be visible
  1757 |       await this.waitForRawMaterialsSection();
  1758 | 
  1759 |       let successCount = 0;
  1760 | 
  1761 |       for (let i = 0; i < rawMaterials.length; i++) {
  1762 |         try {
  1763 |           console.log(`  [${i + 1}/${rawMaterials.length}] Adding Raw Material...`);
  1764 | 
  1765 |           // Click Create button to add new row
  1766 |           await this.clickRawMaterialsCreateButton();
  1767 | 
  1768 |           // Wait for new row to appear
  1769 |           await this.waitForRawMaterialsTableRow();
  1770 | 
  1771 |           // Fill the newly created row at the TOP (index 0)
  1772 |           const success = await this.fillRawMaterialRow(
  1773 |             0, // rowIndex not used when fillFirstRow is true
  1774 |             rawMaterials[i].itemCode,
  1775 |             rawMaterials[i].itemName,
  1776 |             true // fillFirstRow = true (always fill the first row which is newly created at top)
  1777 |           );
  1778 | 
  1779 |           if (success) {
  1780 |             console.log(`    ✓ Raw Material ${i + 1} added successfully\n`);
  1781 |             successCount++;
  1782 |           } else {
  1783 |             console.log(`    ✗ Failed to add Raw Material ${i + 1}\n`);
  1784 |           }
  1785 |         } catch (e) {
  1786 |           console.error(`  ✗ Error adding Raw Material ${i + 1}: ${e}`);
  1787 |         }
  1788 |       }
  1789 | 
  1790 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1791 |       console.log(`║ ✓ Raw Materials Added: ${successCount}/${rawMaterials.length}`);
  1792 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1793 | 
  1794 |       return {
  1795 |         successCount,
  1796 |         totalRows: rawMaterials.length,
  1797 |         allAdded: successCount === rawMaterials.length
  1798 |       };
  1799 |     } catch (e) {
  1800 |       console.error('\n✗ Failed to add Raw Materials:');
  1801 |       console.error(e);
  1802 |       throw e;
  1803 |     }
  1804 |   }
  1805 | 
  1806 |   // Allocation Hierarchy Methods
  1807 | 
  1808 |   async scrollToAllocationHierarchySection() {
  1809 |     try {
  1810 |       await this.page.evaluate(() => {
  1811 |         const allocationSection = document.querySelector('[id*="StyleTreeTable"]');
  1812 |         if (allocationSection) {
  1813 |           allocationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1814 |         }
  1815 |       });
  1816 |       await this.page.waitForTimeout(800);
  1817 |       console.log('  ✓ Scrolled to Allocation Hierarchy section');
  1818 |     } catch (e) {
  1819 |       console.log('  ⚠️  Could not scroll to Allocation Hierarchy section');
  1820 |     }
  1821 |   }
  1822 | 
  1823 |   async waitForAllocationHierarchySection() {
> 1824 |     await this.allocationHierarchySection.waitFor({ state: 'visible', timeout: 10000 });
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1825 |     console.log('  ✓ Allocation Hierarchy section is visible');
  1826 |   }
  1827 | 
  1828 |   async expandTreeNode(rowIndex: number) {
  1829 |     try {
  1830 |       const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1831 |       const row = allRows.nth(rowIndex);
  1832 | 
  1833 |       // Find the tree icon (expand/collapse button)
  1834 |       const treeIcon = row.locator('span[class*="sapUiTableTreeIcon"]').first();
  1835 |       const isExpandable = await treeIcon.evaluate((el) => {
  1836 |         return el.classList.contains('sapUiTableTreeIconNodeClosed');
  1837 |       });
  1838 | 
  1839 |       if (isExpandable) {
  1840 |         await treeIcon.click();
  1841 |         await this.page.waitForTimeout(500);
  1842 |         console.log(`    ✓ Expanded node at row ${rowIndex + 1}`);
  1843 |         return true;
  1844 |       } else {
  1845 |         console.log(`    ℹ️  Node at row ${rowIndex + 1} is not expandable`);
  1846 |         return false;
  1847 |       }
  1848 |     } catch (e) {
  1849 |       console.error(`    ✗ Failed to expand node: ${e}`);
  1850 |       return false;
  1851 |     }
  1852 |   }
  1853 | 
  1854 |   async fillAllocationQuantities(allocations: Array<{ rowIndex: number; quantity: string }>) {
  1855 |     try {
  1856 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
  1857 |       console.log('║        FILLING ALLOCATION HIERARCHY QUANTITIES              ║');
  1858 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1859 | 
  1860 |       // Scroll to section
  1861 |       await this.scrollToAllocationHierarchySection();
  1862 |       await this.waitForAllocationHierarchySection();
  1863 | 
  1864 |       let successCount = 0;
  1865 | 
  1866 |       for (const allocation of allocations) {
  1867 |         try {
  1868 |           const rowIndex = allocation.rowIndex;
  1869 |           const quantity = allocation.quantity;
  1870 | 
  1871 |           console.log(`  ╔═════════════════════════════════════════════════════╗`);
  1872 |           console.log(`  ║ Row ${rowIndex + 1}: Quantity=${quantity}`);
  1873 |           console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1874 | 
  1875 |           // Get fresh row reference
  1876 |           const allRows = this.allocationHierarchyTableBody.locator('tr[role="row"]');
  1877 |           const currentRow = allRows.nth(rowIndex);
  1878 | 
  1879 |           // Get the quantity input field (second column)
  1880 |           const quantityInput = currentRow
  1881 |             .locator('td[data-sap-ui-colid*="styleTreeColQuantity"]')
  1882 |             .first()
  1883 |             .locator('input[type="text"]')
  1884 |             .first();
  1885 | 
  1886 |           // Scroll row into view
  1887 |           await currentRow.scrollIntoViewIfNeeded();
  1888 |           await this.page.waitForTimeout(300);
  1889 | 
  1890 |           // Check if input exists
  1891 |           const inputExists = await quantityInput.count();
  1892 |           if (inputExists === 0) {
  1893 |             console.log(`    ✗ Quantity input field not found for row ${rowIndex + 1}`);
  1894 |             continue;
  1895 |           }
  1896 | 
  1897 |           // Wait for input to be visible
  1898 |           await quantityInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  1899 | 
  1900 |           // Click and fill the input
  1901 |           await quantityInput.click();
  1902 |           await this.page.waitForTimeout(150);
  1903 |           await quantityInput.fill(quantity);
  1904 |           console.log(`    ✓ Quantity filled: ${quantity}`);
  1905 | 
  1906 |           // Press Tab to confirm
  1907 |           await this.page.keyboard.press('Tab');
  1908 |           await this.page.waitForLoadState('networkidle');
  1909 |           await this.page.waitForTimeout(500);
  1910 | 
  1911 |           // Verify the value was saved
  1912 |           const savedValue = await quantityInput.inputValue();
  1913 |           if (savedValue === quantity) {
  1914 |             console.log(`    ✓ Value verified: ${savedValue}`);
  1915 |             successCount++;
  1916 |           } else {
  1917 |             console.log(`    ⚠️  Value mismatch (expected '${quantity}', got '${savedValue}')`);
  1918 |           }
  1919 |         } catch (e) {
  1920 |           console.error(`  ✗ Error processing allocation: ${e}`);
  1921 |         }
  1922 |       }
  1923 | 
  1924 |       console.log('\n╔════════════════════════════════════════════════════════════╗');
```