# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 54. Add Raw Materials to Style Master
- Location: e2e\apparel_regression_testing.spec.ts:1221:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[id*="RawMaterials"]') to be visible

```

# Test source

```ts
  1573 | 
  1574 |               if (priceExists === 0) {
  1575 |                 console.log(`    ⚠️  Price input field not found`);
  1576 |               } else {
  1577 |                 // Click the price field to focus it
  1578 |                 await priceInput.click();
  1579 |                 await this.page.waitForTimeout(200);
  1580 | 
  1581 |                 // Fill with price value
  1582 |                 await priceInput.fill(price);
  1583 |                 console.log(`    ✓ Filled Price with: '${price}'`);
  1584 | 
  1585 |                 // Trigger change event by pressing Enter
  1586 |                 await priceInput.press('Enter');
  1587 |                 await this.page.waitForTimeout(500);
  1588 |               }
  1589 |             } catch (e) {
  1590 |               console.log(`    ✗ Error filling Price: ${e}`);
  1591 |             }
  1592 |           }
  1593 | 
  1594 |           // Wait a bit for all changes to be saved
  1595 |           await this.page.waitForTimeout(800);
  1596 | 
  1597 |           // Verify values were actually saved by checking fresh references
  1598 |           try {
  1599 |             // Get fresh row reference by counting from the start
  1600 |             const freshAllRows = this.page.locator('table[id*="FinishGoods-innerTable-table"] tbody').last().locator('tr[role="row"]');
  1601 |             const freshRow = freshAllRows.nth(i);
  1602 | 
  1603 |             const verifyBuyerPOInput = freshRow.locator('td[data-sap-ui-colid*="BuyerPOItem"]').first().locator('input[role="combobox"]').first();
  1604 |             const verifyPriceInput = freshRow.locator('td[data-sap-ui-colid*="Price"]').first().locator('input[type="text"]').first();
  1605 | 
  1606 |             const buyerPOValue = await verifyBuyerPOInput.inputValue();
  1607 |             const priceValue = await verifyPriceInput.inputValue();
  1608 | 
  1609 |             console.log(`    ℹ️  Verification - Row ${i + 1}: BuyerPO='${buyerPOValue}', Price='${priceValue}'`);
  1610 | 
  1611 |             if (buyerPOValue && buyerPOValue.trim().toUpperCase() === itemCode.trim().toUpperCase()) {
  1612 |               console.log(`    ✓ Row ${i + 1} saved successfully`);
  1613 |               successCount++;
  1614 |             } else {
  1615 |               console.log(`    ⚠️  Row ${i + 1}: Value mismatch (expected '${itemCode.trim().toUpperCase()}', got '${buyerPOValue}')`);
  1616 |             }
  1617 |           } catch (e) {
  1618 |             console.log(`    ✗ Row ${i + 1}: Verification error - ${String(e).substring(0, 50)}`);
  1619 |           }
  1620 | 
  1621 |         } catch (e) {
  1622 |           const errorMsg = e instanceof Error ? e.message : String(e);
  1623 |           console.log(`  ✗ Row ${i + 1}: Error - ${errorMsg.substring(0, 80)}`);
  1624 |         }
  1625 |       }
  1626 | 
  1627 |       console.log(`\n📊 Summary: ${successCount}/${totalRows} items filled\n`);
  1628 | 
  1629 |       console.log('╔════════════════════════════════════════════════════════════╗');
  1630 |       if (totalRows === 0) {
  1631 |         console.log('║ ✓ NO DATA TO PROCESS (VALID NO-OP)                        ║');
  1632 |       } else if (successCount === totalRows) {
  1633 |         console.log(`║ ✓ COMPLETED: ${successCount}/${totalRows} BUYER PO ITEMS FILLED          ║`);
  1634 |       } else if (successCount > 0) {
  1635 |         console.log(`║ ⚠️  PARTIALLY COMPLETED: ${successCount}/${totalRows} ITEMS FILLED        ║`);
  1636 |       } else {
  1637 |         console.log('║ ℹ️  NO ITEMS FILLED                                        ║');
  1638 |       }
  1639 |       console.log('╚════════════════════════════════════════════════════════════╝\n');
  1640 | 
  1641 |       return {
  1642 |         allSelected: totalRows === 0 || successCount === totalRows,
  1643 |         successCount,
  1644 |         totalRows
  1645 |       };
  1646 |     } catch (e) {
  1647 |       console.error('\n✗ Failed to fill Buyer PO Items:');
  1648 |       console.error(e);
  1649 |       throw e;
  1650 |     }
  1651 |   }
  1652 | 
  1653 |   // Raw Materials Methods
  1654 | 
  1655 |   async scrollToRawMaterialsSection() {
  1656 |     try {
  1657 |       await this.page.evaluate(() => {
  1658 |         const rawMaterialsSection = document.querySelector('[id*="RawMaterials"]');
  1659 |         if (rawMaterialsSection) {
  1660 |           rawMaterialsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  1661 |         }
  1662 |       });
  1663 |       await this.page.waitForTimeout(800);
  1664 |       console.log('  ✓ Scrolled to Raw Materials section');
  1665 |     } catch (e) {
  1666 |       console.log('  ⚠️  Could not scroll to Raw Materials section');
  1667 |     }
  1668 |   }
  1669 | 
  1670 |   async waitForRawMaterialsSection() {
  1671 |     // Use a more flexible selector that matches the scrolling selector
  1672 |     const selector = this.page.locator('[id*="RawMaterials"]');
> 1673 |     await selector.waitFor({ state: 'visible', timeout: 10000 });
       |                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1674 |     console.log('  ✓ Raw Materials section is visible');
  1675 |   }
  1676 | 
  1677 |   async clickRawMaterialsCreateButton() {
  1678 |     try {
  1679 |       // Scroll to ensure button is visible
  1680 |       await this.scrollToRawMaterialsSection();
  1681 |       await this.page.waitForTimeout(500);
  1682 | 
  1683 |       // Check if button exists
  1684 |       const buttonCount = await this.rawMaterialsCreateButton.count();
  1685 |       if (buttonCount === 0) {
  1686 |         throw new Error('Raw Materials Create button not found in DOM');
  1687 |       }
  1688 | 
  1689 |       // Wait for the create button to be visible
  1690 |       await this.rawMaterialsCreateButton.waitFor({ state: 'visible', timeout: 10000 });
  1691 | 
  1692 |       // Try normal click first
  1693 |       try {
  1694 |         await this.rawMaterialsCreateButton.click({ timeout: 5000 });
  1695 |         console.log('  ✓ Raw Materials Create button clicked');
  1696 |       } catch (clickError) {
  1697 |         // If normal click fails, try with force
  1698 |         console.log('  ℹ️  Normal click failed, trying with force...');
  1699 |         await this.rawMaterialsCreateButton.click({ force: true, timeout: 5000 });
  1700 |         console.log('  ✓ Raw Materials Create button clicked (forced)');
  1701 |       }
  1702 | 
  1703 |       await this.page.waitForLoadState('networkidle');
  1704 |       await this.page.waitForTimeout(800);
  1705 |     } catch (e) {
  1706 |       console.error(`  ✗ Failed to click Raw Materials Create button: ${e}`);
  1707 |       throw e;
  1708 |     }
  1709 |   }
  1710 | 
  1711 |   async waitForRawMaterialsTableRow() {
  1712 |     try {
  1713 |       // Wait for the table body to exist
  1714 |       await this.rawMaterialsTableBody.first().waitFor({ state: 'visible', timeout: 10000 });
  1715 | 
  1716 |       // Wait for any row in the table
  1717 |       const allRows = this.rawMaterialsTableBody.first().locator('tr[role="row"]');
  1718 |       await allRows.first().waitFor({ state: 'visible', timeout: 10000 });
  1719 | 
  1720 |       // Extra wait for row to be fully rendered
  1721 |       await this.page.waitForTimeout(1000);
  1722 |       console.log('  ✓ New row detected in table');
  1723 |     } catch (e) {
  1724 |       console.error(`  ✗ Failed to wait for Raw Materials row: ${e}`);
  1725 |       throw e;
  1726 |     }
  1727 |   }
  1728 | 
  1729 |   async fillRawMaterialRow(itemCode: string, itemName: string) {
  1730 |     try {
  1731 |       console.log(`\n  ╔═════════════════════════════════════════════════════╗`);
  1732 |       console.log(`  ║ Code: ${itemCode}, Name: ${itemName}`);
  1733 |       console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1734 | 
  1735 |       // Get all rows from the table body
  1736 |       const tableBody = this.rawMaterialsTableBody.first();
  1737 |       const allRows = tableBody.locator('tr[role="row"]');
  1738 |       const rowCount = await allRows.count();
  1739 | 
  1740 |       console.log(`    Total rows in table: ${rowCount}`);
  1741 | 
  1742 |       if (rowCount === 0) {
  1743 |         console.error(`    ✗ No rows found in table`);
  1744 |         return false;
  1745 |       }
  1746 | 
  1747 |       // Get the first row (newly created one at top)
  1748 |       const firstRow = allRows.first();
  1749 | 
  1750 |       // Find all input fields in the first row
  1751 |       const inputFields = firstRow.locator('input[type="text"]');
  1752 |       const inputCount = await inputFields.count();
  1753 | 
  1754 |       console.log(`    Input fields in first row: ${inputCount}`);
  1755 | 
  1756 |       if (inputCount < 2) {
  1757 |         console.error(`    ✗ Expected 2 inputs, found ${inputCount}`);
  1758 |         return false;
  1759 |       }
  1760 | 
  1761 |       // Get specific inputs
  1762 |       const itemCodeInput = inputFields.nth(0);
  1763 |       const itemNameInput = inputFields.nth(1);
  1764 | 
  1765 |       // Scroll and wait
  1766 |       await firstRow.scrollIntoViewIfNeeded();
  1767 |       await this.page.waitForTimeout(500);
  1768 | 
  1769 |       // Fill Item Code
  1770 |       console.log(`    → Filling Item Code...`);
  1771 |       await itemCodeInput.click();
  1772 |       await this.page.waitForTimeout(200);
  1773 |       await itemCodeInput.fill(itemCode);
```