# POM Refactoring Guide - StyleMasterCreate

## Overview
This guide shows how to refactor StyleMasterCreate.ts (and other POMs) to use the new BasePage infrastructure.

---

## What's Already Done ✅

1. ✅ Created `src/pages/BasePage.ts` with all helper methods
2. ✅ Created `src/types/` directory with interfaces
3. ✅ Updated StyleMasterCreate class declaration to extend BasePage
4. ✅ Refactored first 5 methods as examples (clickDepartmentsValueHelp, selectDepartmentByRoutingPlan, etc.)

---

## Pattern Examples

### Before (Old Pattern)
```typescript
async selectDepartmentByRoutingPlan(routingPlanName: string) {
  const matchingRow = this.departmentsTableBody.locator(
    `tr[role="row"]:has(span:text("${routingPlanName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}

async selectFirstDepartment() {
  const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  await firstRow.click();
  await this.page.waitForLoadState('networkidle');
}

async selectRandomMerchandiser() {
  const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  const rowCount = await allRows.count();
  
  if (rowCount === 0) {
    throw new Error('No merchandiser rows found');
  }
  
  const randomIndex = Math.floor(Math.random() * rowCount);
  await allRows.nth(randomIndex).click();
  await this.page.waitForLoadState('networkidle');
  console.log(`Selected at index: ${randomIndex}`);
}
```

### After (New Pattern with BasePage)
```typescript
/**
 * Select department by routing plan name from dropdown
 */
async selectDepartmentByRoutingPlan(routingPlanName: string): Promise<void> {
  this.logAction('Selecting department', routingPlanName);
  await this.selectTableRowByText(this.departmentsTableBody, routingPlanName);
}

/**
 * Select first department from dropdown
 */
async selectFirstDepartment(): Promise<void> {
  this.logAction('Selecting first department');
  await this.selectTableRowByIndex(this.departmentsTableBody, 0);
}

/**
 * Select random merchandiser from dropdown
 */
async selectRandomMerchandiser(): Promise<number> {
  this.logAction('Selecting random merchandiser');
  return await this.selectRandomTableRow(this.merchandiserTableBody);
}
```

---

## Step-by-Step Refactoring Instructions

### Step 1: Pattern Recognition
Identify common patterns in your methods:
- ✅ **Value Help Click**: `button.click()` + `waitForLoadState()`
- ✅ **Dropdown Selection**: Find row + Click + wait
- ✅ **Input Fill**: `locator.fill()` + wait
- ✅ **Random Selection**: Get count + calculate random + click

### Step 2: Apply Mapping

| Old Pattern | New BasePage Method |
|---|---|
| `click() + waitForLoadState()` | `clickWithRetry()` |
| `fill()` | `fillInputField()` |
| Find + click row by text | `selectTableRowByText()` |
| Find + click row by index | `selectTableRowByIndex()` |
| Random row selection | `selectRandomTableRow()` |
| Get text content | `getElementText()` |
| Get input value | `getInputValue()` |
| Check visibility | `isElementVisible()` |
| Log action | `logAction()` |
| Log error | `logError()` |

### Step 3: Add JSDoc Comments
Every method should have JSDoc:
```typescript
/**
 * Brief description of what the method does
 * @param paramName - Parameter description
 * @returns Return type description
 */
async methodName(paramName: string): Promise<void> {
  // ...
}
```

### Step 4: Add Type Hints
All methods should have explicit return types:
```typescript
// ❌ BAD - No return type
async selectCustomerByName(customerName: string) {
  // ...
}

// ✅ GOOD - Explicit return type
async selectCustomerByName(customerName: string): Promise<void> {
  // ...
}

// ✅ GOOD - With return value
async selectRandomCustomer(): Promise<number> {
  return await this.selectRandomTableRow(this.customerTableBody);
}
```

---

## Refactoring Checklist

For each method in StyleMasterCreate.ts, follow this checklist:

### Standard Selection Methods
```typescript
// ❌ OLD
async selectCustomerByName(customerName: string) {
  const matchingRow = this.customerTableBody.locator(
    `tr[role="row"]:has(span:text("${customerName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}

// ✅ NEW
/**
 * Select customer by name from dropdown
 */
async selectCustomerByName(customerName: string): Promise<void> {
  this.logAction('Selecting customer', customerName);
  await this.selectTableRowByText(this.customerTableBody, customerName);
}
```

### First Item Selection Methods
```typescript
// ❌ OLD
async selectFirstCustomer() {
  const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  await firstRow.click();
  await this.page.waitForLoadState('networkidle');
}

// ✅ NEW
/**
 * Select first customer from dropdown
 */
async selectFirstCustomer(): Promise<void> {
  this.logAction('Selecting first customer');
  await this.selectTableRowByIndex(this.customerTableBody, 0);
}
```

### Random Selection Methods
```typescript
// ❌ OLD
async selectRandomMerchandiser() {
  const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  const rowCount = await allRows.count();
  
  if (rowCount === 0) {
    throw new Error('No merchandiser rows found');
  }
  
  const randomIndex = Math.floor(Math.random() * rowCount);
  await allRows.nth(randomIndex).click();
  await this.page.waitForLoadState('networkidle');
  console.log(`Selected at index: ${randomIndex}`);
}

// ✅ NEW
/**
 * Select random merchandiser from dropdown
 * @returns Index of selected row
 */
async selectRandomMerchandiser(): Promise<number> {
  this.logAction('Selecting random merchandiser');
  return await this.selectRandomTableRow(this.merchandiserTableBody);
}
```

### Input Fill Methods
```typescript
// ❌ OLD
async fillVCP(value: string) {
  await this.page.evaluate(() => window.scrollBy(0, 500));
  await this.page.waitForTimeout(500);
  
  try {
    // ... complex logic
  } catch {
    // ... error handling
  }
}

// ✅ NEW (simplified version)
/**
 * Fill VCP input field
 */
async fillVCP(value: string): Promise<void> {
  this.logAction('Filling VCP', value);
  await this.scrollIntoView(this.vcpInput);
  await this.fillInputField(this.vcpInput, value);
}
```

### Value Help Button Click Methods
```typescript
// ❌ OLD
async clickMerchandiserValueHelp() {
  await this.merchandiserValueHelpButton.click();
  await this.page.waitForLoadState('networkidle');
}

async waitForMerchandiserDropdownLoad() {
  await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  await this.page.waitForTimeout(2000);
}

// ✅ NEW
/**
 * Open merchandiser dropdown via value help button
 */
async clickMerchandiserValueHelp(): Promise<void> {
  this.logAction('Opening merchandiser dropdown');
  await this.clickValueHelpButton(this.merchandiserValueHelpButton);
}

// Note: waitForMerchandiserDropdownLoad() can be removed as waitForSAPDropdownLoad() handles it
```

---

## Grouping Methods by Category

For better organization, group methods in this order:

```typescript
export class StyleMasterCreate extends BasePage {
  // ... locator definitions ...
  
  // FORM INITIALIZATION
  async waitForFormLoad(): Promise<void> { ... }
  async goto(): Promise<void> { ... }
  
  // DEPARTMENTS DROPDOWN
  async clickDepartmentsValueHelp(): Promise<void> { ... }
  async selectDepartmentByRoutingPlan(): Promise<void> { ... }
  async selectFirstDepartment(): Promise<void> { ... }
  
  // CUSTOMER DROPDOWN
  async clickCustomerValueHelp(): Promise<void> { ... }
  async selectCustomerByName(): Promise<void> { ... }
  async selectFirstCustomer(): Promise<void> { ... }
  async selectRandomCustomer(): Promise<number> { ... }
  
  // MERCHANDISER DROPDOWN
  async clickMerchandiserValueHelp(): Promise<void> { ... }
  async selectRandomMerchandiser(): Promise<number> { ... }
  
  // ... more sections ...
  
  // FORM DATA ENTRY (Input fields)
  async fillConsiderPacking(value: string): Promise<void> { ... }
  async fillVCP(value: string): Promise<void> { ... }
  async fillMake(value: string): Promise<void> { ... }
  async fillPrice(value: string): Promise<void> { ... }
  
  // FORM DATA RETRIEVAL
  async getCapturedStyleData(): Promise<Map<string, string>> { ... }
  
  // COMPLEX OPERATIONS
  async fillAllSegmentData(): Promise<FillSegmentDataResult> { ... }
  async selectBuyerPOItemsForFinishGoods(): Promise<SelectBuyerPOItemsResult> { ... }
  
  // UTILITY METHODS
  private async findSegmentSectionByType(): Promise<string> { ... }
}
```

---

## Methods Not Covered by BasePage

Some complex methods may need to stay as-is (minimal refactoring):

1. **fillAllSegmentData()** - Complex loop logic, but add type hints
2. **selectBuyerPOItemsForFinishGoods()** - Complex nested loops, keep structure
3. **captureAndSaveFormData()** - File I/O logic, stays the same
4. **Helper methods** - Private utility methods for specific workflows

For these, just:
- ✅ Add JSDoc comments
- ✅ Add explicit return types
- ✅ Replace `console.log()` with `this.logAction()`
- ✅ Replace error handling with `this.logError()`

---

## Example: Refactoring a Complex Method

```typescript
// ❌ OLD
async selectRandomCustomer() {
  const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  await this.page.waitForTimeout(2000);

  const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  const rowCount = await allRows.count();

  if (rowCount === 0) {
    throw new Error('No customer rows found in the customer dialog table');
  }

  const randomIndex = Math.floor(Math.random() * rowCount);
  const randomRow = allRows.nth(randomIndex);
  const firstCell = randomRow.locator('td').first();
  await firstCell.click();
  await this.page.waitForLoadState('networkidle');
  console.log(`Selected customer at random index: ${randomIndex}`);
}

// ✅ NEW
/**
 * Select a random customer from the customer dialog
 * Note: Uses cell click instead of row click to avoid overlay issues
 * @returns Index of selected customer row
 */
async selectRandomCustomer(): Promise<number> {
  this.logAction('Selecting random customer from dialog');
  
  try {
    const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
    const rowCount = await this.waitForElements(allRows, 1, this.WAIT_TIMEOUT_LONG);

    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = allRows.nth(randomIndex);
    const firstCell = randomRow.locator('td').first();
    
    await firstCell.click();
    await this.waitForSAPFormLoad();
    
    return randomIndex;
  } catch (error) {
    this.logError('Failed to select random customer', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}
```

---

## Migration Order (Recommended)

1. ✅ **Phase 1** - Simple selection methods (selectDepartmentByName, selectFirstCustomer, etc.)
2. ✅ **Phase 2** - Value help click methods (clickCustomerValueHelp, clickMerchandiserValueHelp, etc.)
3. ✅ **Phase 3** - Input field methods (fillConsiderPacking, fillVCP, fillPrice, etc.)
4. ✅ **Phase 4** - Complex operations (fillAllSegmentData, selectBuyerPOItemsForFinishGoods)
5. ✅ **Phase 5** - Test and verify all methods work correctly

---

## Testing After Refactoring

After refactoring each method:
```bash
# Run specific test
npx playwright test e2e/apparel_regression_testing.spec.ts -g "TC-STY-001"

# Run all Style Master tests
npx playwright test e2e/apparel_regression_testing.spec.ts -g "StyleMaster"

# Run full suite
npx playwright test e2e/apparel_regression_testing.spec.ts
```

---

## Quick Reference: Common Refactorings

### Click + Wait Pattern
```typescript
// OLD
await this.customerValueHelpButton.click();
await this.page.waitForLoadState('networkidle');

// NEW
await this.clickValueHelpButton(this.customerValueHelpButton);
```

### Fill + Wait Pattern
```typescript
// OLD
await this.priceInput.fill(value);
await this.page.waitForLoadState('networkidle');

// NEW
await this.fillInputField(this.priceInput, value);
```

### Find + Click Pattern
```typescript
// OLD
const matchingRow = this.tableBody.locator(`tr[role="row"]:has(span:text("${text}"))`);
await matchingRow.click();
await this.page.waitForLoadState('networkidle');

// NEW
await this.selectTableRowByText(this.tableBody, text);
```

### Random Selection Pattern
```typescript
// OLD
const rowCount = await rows.count();
if (rowCount === 0) throw new Error('No rows');
const randomIndex = Math.floor(Math.random() * rowCount);
await rows.nth(randomIndex).click();
console.log(`Selected index: ${randomIndex}`);

// NEW
const randomIndex = await this.selectRandomTableRow(this.tableBody);
```

### Error Logging Pattern
```typescript
// OLD
console.error(`Error: ${error.message}`);
throw error;

// NEW
this.logError('Operation failed', error instanceof Error ? error.message : 'Unknown error');
throw error;
```

---

## Next Steps

1. Continue refactoring remaining methods in StyleMasterCreate.ts
2. Apply same pattern to other POM files (VendorCreate, SubMasterBranchCreate, etc.)
3. Run full test suite to verify everything works
4. Commit changes with clear message: "refactor: Implement BasePage infrastructure for SAP POMs"

---

## Questions or Issues?

If you encounter:
- **Selector doesn't work**: Check if locator needs adjustment in constructor
- **Method signature conflict**: Check BasePage for similar method
- **Test failure after refactor**: Verify wait times match actual UI behavior
- **Type errors**: Ensure return types match interfaces in src/types/

Use `this.logAction()` and `this.logWarning()` to debug issues!
