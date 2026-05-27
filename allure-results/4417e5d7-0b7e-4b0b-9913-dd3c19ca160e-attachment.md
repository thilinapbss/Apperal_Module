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
  1736 |         // Find any element with RawMaterials and StandardAction::Create
  1737 |         const elements = document.querySelectorAll('[id*="RawMaterials"]');
  1738 |         for (const elem of elements) {
  1739 |           const id = elem.getAttribute('id') || '';
  1740 |           if (id.includes('StandardAction::Create')) {
  1741 |             return id;
  1742 |           }
  1743 |         }
  1744 |         return null;
  1745 |       });
  1746 | 
  1747 |       if (!buttonFound) {
  1748 |         console.log('  → Button not found, searching by text...');
  1749 | 
  1750 |         // Try finding by text "Create" in RawMaterials section
  1751 |         const createButtonFound = await this.page.evaluate(() => {
  1752 |           const rawMatsec = document.querySelector('[id*="RawMaterials"]');
  1753 |           if (!rawMatsec) return null;
  1754 |           const createBtns = rawMatsec.querySelectorAll('*');
  1755 |           for (const elem of createBtns) {
  1756 |             if (elem.textContent?.trim() === 'Create') {
  1757 |               return elem.getAttribute('id');
  1758 |             }
  1759 |           }
  1760 |           return null;
  1761 |         });
  1762 | 
  1763 |         if (!createButtonFound) {
  1764 |           throw new Error('Raw Materials Create button not found in DOM');
  1765 |         }
  1766 | 
  1767 |         // Click using the found ID
  1768 |         await this.page.evaluate((id) => {
  1769 |           const elem = document.getElementById(id);
  1770 |           if (elem) {
  1771 |             elem.scrollIntoView({ behavior: 'auto', block: 'center' });
  1772 |             setTimeout(() => {
  1773 |               elem.click();
  1774 |             }, 300);
  1775 |           }
  1776 |         }, createButtonFound);
  1777 |       } else {
  1778 |         // Click the found button
  1779 |         await this.page.evaluate((id) => {
  1780 |           const elem = document.getElementById(id);
  1781 |           if (elem) {
  1782 |             elem.scrollIntoView({ behavior: 'auto', block: 'center' });
  1783 |             setTimeout(() => {
  1784 |               elem.click();
  1785 |             }, 300);
  1786 |           }
  1787 |         }, buttonFound);
  1788 |       }
  1789 | 
  1790 |       console.log('  ✓ Raw Materials Create button clicked');
  1791 | 
  1792 |       await this.page.waitForLoadState('networkidle');
  1793 |       await this.page.waitForTimeout(800);
  1794 |     } catch (e) {
  1795 |       console.error(`  ✗ Failed to click Raw Materials Create button: ${e}`);
  1796 |       throw e;
  1797 |     }
  1798 |   }
  1799 | 
  1800 |   async waitForRawMaterialsTableRow() {
  1801 |     try {
  1802 |       // Debug: Find the actual table
  1803 |       const actualTable = await this.page.evaluate(() => {
  1804 |         const tables = Array.from(document.querySelectorAll('table[id*="RawMaterials"]'));
  1805 |         return tables.map(t => ({
  1806 |           id: t.getAttribute('id'),
  1807 |           rows: t.querySelectorAll('tr[role="row"]').length
  1808 |         }));
  1809 |       });
  1810 | 
  1811 |       console.log(`  → Found ${actualTable.length} RawMaterials tables with ${actualTable.map(t => t.rows).join(', ')} rows`);
  1812 | 
  1813 |       // Wait for the table body to exist with a longer timeout
  1814 |       await this.rawMaterialsTableBody.first().waitFor({ state: 'visible', timeout: 15000 });
  1815 | 
  1816 |       // Wait for any row in the table
  1817 |       const allRows = this.rawMaterialsTableBody.first().locator('tr[role="row"]');
  1818 |       await allRows.first().waitFor({ state: 'visible', timeout: 15000 });
  1819 | 
  1820 |       // Extra wait for row to be fully rendered
  1821 |       await this.page.waitForTimeout(1000);
  1822 |       console.log('  ✓ New row detected in table');
  1823 |     } catch (e) {
  1824 |       console.error(`  ✗ Failed to wait for Raw Materials row: ${e}`);
  1825 |       throw e;
  1826 |     }
  1827 |   }
  1828 | 
  1829 |   async fillRawMaterialRow(itemCode: string, itemName: string) {
  1830 |     try {
  1831 |       console.log(`\n  ╔═════════════════════════════════════════════════════╗`);
  1832 |       console.log(`  ║ Code: ${itemCode}, Name: ${itemName}`);
  1833 |       console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1834 | 
  1835 |       // Get all rows from the table body
> 1836 |       const tableBody = this.rawMaterialsTableBody.first();
       |                                           ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1837 |       const allRows = tableBody.locator('tr[role="row"]');
  1838 |       const rowCount = await allRows.count();
  1839 | 
  1840 |       console.log(`    Total rows in table: ${rowCount}`);
  1841 | 
  1842 |       if (rowCount === 0) {
  1843 |         console.error(`    ✗ No rows found in table`);
  1844 |         return false;
  1845 |       }
  1846 | 
  1847 |       // Get the first row (newly created one at top)
  1848 |       // Find inputs using the specific aria-labelledby selectors
  1849 |       const itemCodeInput = this.page.locator('input[aria-labelledby*="ItemCode-innerColumn"]').first();
  1850 |       const itemNameInput = this.page.locator('input[aria-labelledby*="ItemName-innerColumn"]').first();
  1851 | 
  1852 |       // Verify inputs exist
  1853 |       const codeExists = await itemCodeInput.count();
  1854 |       const nameExists = await itemNameInput.count();
  1855 | 
  1856 |       if (codeExists === 0 || nameExists === 0) {
  1857 |         console.error(`    ✗ Required input fields not found. Code: ${codeExists}, Name: ${nameExists}`);
  1858 |         return false;
  1859 |       }
  1860 | 
  1861 |       console.log(`    ✓ Found ItemCode and ItemName input fields`);
  1862 | 
  1863 |       // Scroll inputs into view
  1864 |       await itemCodeInput.scrollIntoViewIfNeeded();
  1865 |       await this.page.waitForTimeout(300);
  1866 | 
  1867 |       // Fill Item Code
  1868 |       console.log(`    → Filling Item Code with "${itemCode}"...`);
  1869 |       await itemCodeInput.click({ timeout: 3000 });
  1870 |       await this.page.waitForTimeout(200);
  1871 |       await itemCodeInput.fill(itemCode);
  1872 |       await this.page.waitForTimeout(300);
  1873 |       console.log(`      ✓ Code entered: ${itemCode}`);
  1874 | 
  1875 |       // Fill Item Name
  1876 |       console.log(`    → Filling Item Name with "${itemName}"...`);
  1877 |       await itemNameInput.scrollIntoViewIfNeeded();
  1878 |       await this.page.waitForTimeout(200);
  1879 |       await itemNameInput.click({ timeout: 3000 });
  1880 |       await this.page.waitForTimeout(200);
  1881 |       await itemNameInput.fill(itemName);
  1882 |       await this.page.waitForTimeout(300);
  1883 |       console.log(`      ✓ Name entered: ${itemName}`);
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
```