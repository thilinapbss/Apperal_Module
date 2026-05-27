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
  - waiting for locator('section[id*="RawMaterials"]') to be visible

```

# Test source

```ts
  1571 |               const priceInput = priceCell.locator('input[type="text"]').first();
  1572 |               const priceExists = await priceInput.count();
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
> 1671 |     await this.rawMaterialsSection.waitFor({ state: 'visible', timeout: 10000 });
       |                                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  1672 |     console.log('  ✓ Raw Materials section is visible');
  1673 |   }
  1674 | 
  1675 |   async clickRawMaterialsCreateButton() {
  1676 |     try {
  1677 |       // Scroll to ensure button is visible
  1678 |       await this.scrollToRawMaterialsSection();
  1679 |       await this.page.waitForTimeout(500);
  1680 | 
  1681 |       // Check if button exists
  1682 |       const buttonCount = await this.rawMaterialsCreateButton.count();
  1683 |       if (buttonCount === 0) {
  1684 |         throw new Error('Raw Materials Create button not found in DOM');
  1685 |       }
  1686 | 
  1687 |       // Wait for the create button to be visible
  1688 |       await this.rawMaterialsCreateButton.waitFor({ state: 'visible', timeout: 10000 });
  1689 | 
  1690 |       // Try normal click first
  1691 |       try {
  1692 |         await this.rawMaterialsCreateButton.click({ timeout: 5000 });
  1693 |         console.log('  ✓ Raw Materials Create button clicked');
  1694 |       } catch (clickError) {
  1695 |         // If normal click fails, try with force
  1696 |         console.log('  ℹ️  Normal click failed, trying with force...');
  1697 |         await this.rawMaterialsCreateButton.click({ force: true, timeout: 5000 });
  1698 |         console.log('  ✓ Raw Materials Create button clicked (forced)');
  1699 |       }
  1700 | 
  1701 |       await this.page.waitForLoadState('networkidle');
  1702 |       await this.page.waitForTimeout(800);
  1703 |     } catch (e) {
  1704 |       console.error(`  ✗ Failed to click Raw Materials Create button: ${e}`);
  1705 |       throw e;
  1706 |     }
  1707 |   }
  1708 | 
  1709 |   async waitForRawMaterialsTableRow() {
  1710 |     try {
  1711 |       const rows = this.rawMaterialsTableBody.locator('tr[role="row"]:not([class*="sapUiTableRowHidden"])');
  1712 |       await rows.first().waitFor({ state: 'visible', timeout: 10000 });
  1713 |       await this.page.waitForTimeout(500);
  1714 |       console.log('  ✓ Raw Materials row created and visible');
  1715 |     } catch (e) {
  1716 |       console.error(`  ✗ Failed to wait for Raw Materials row: ${e}`);
  1717 |       throw e;
  1718 |     }
  1719 |   }
  1720 | 
  1721 |   async fillRawMaterialRow(itemCode: string, itemName: string) {
  1722 |     try {
  1723 |       console.log(`\n  ╔═════════════════════════════════════════════════════╗`);
  1724 |       console.log(`  ║ Code: ${itemCode}, Name: ${itemName}`);
  1725 |       console.log(`  ╚═════════════════════════════════════════════════════╝`);
  1726 | 
  1727 |       // Get the Raw Materials table and find the first visible data row
  1728 |       const tableBody = this.rawMaterialsTableBody.first();
  1729 |       const allRows = tableBody.locator('tr[role="row"]');
  1730 |       const firstVisibleRow = allRows.locator('tr[role="row"]:not([class*="sapUiTableRowHidden"])').first();
  1731 | 
  1732 |       // Get all input fields in the first visible row
  1733 |       const inputFields = firstVisibleRow.locator('input[type="text"]');
  1734 |       const inputCount = await inputFields.count();
  1735 | 
  1736 |       console.log(`    Inputs found in row: ${inputCount}`);
  1737 | 
  1738 |       if (inputCount < 2) {
  1739 |         console.error(`    ✗ Expected 2 input fields, found ${inputCount}`);
  1740 |         return false;
  1741 |       }
  1742 | 
  1743 |       // Get Item Code input (first input in the row)
  1744 |       const itemCodeInput = inputFields.nth(0);
  1745 | 
  1746 |       // Get Item Name input (second input in the row)
  1747 |       const itemNameInput = inputFields.nth(1);
  1748 | 
  1749 |       // Scroll row into view
  1750 |       await firstVisibleRow.scrollIntoViewIfNeeded();
  1751 |       await this.page.waitForTimeout(500);
  1752 | 
  1753 |       console.log(`    ✓ Row visible`);
  1754 | 
  1755 |       // Fill Item Code
  1756 |       await itemCodeInput.waitFor({ state: 'visible', timeout: 10000 });
  1757 |       await itemCodeInput.click();
  1758 |       await this.page.waitForTimeout(200);
  1759 |       await itemCodeInput.fill('');
  1760 |       await this.page.waitForTimeout(100);
  1761 |       await itemCodeInput.fill(itemCode);
  1762 |       console.log(`    ✓ Entered Item Code: ${itemCode}`);
  1763 |       await this.page.waitForTimeout(300);
  1764 | 
  1765 |       // Fill Item Name
  1766 |       await itemNameInput.waitFor({ state: 'visible', timeout: 10000 });
  1767 |       await itemNameInput.click();
  1768 |       await this.page.waitForTimeout(200);
  1769 |       await itemNameInput.fill('');
  1770 |       await this.page.waitForTimeout(100);
  1771 |       await itemNameInput.fill(itemName);
```