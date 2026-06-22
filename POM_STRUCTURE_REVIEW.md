# POM Structure Review & Improvements for SAP Testing

## Current Status: ✅ GOOD FOUNDATION, WITH IMPROVEMENTS NEEDED

---

## 1. WHAT YOU'RE DOING RIGHT ✅

### 1.1 SAP UI5 Selector Pattern
**Current**: Using `[id*="..."]` wildcard selectors
```typescript
this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
```
**Why this works**: SAP UI5 generates dynamic IDs. Using wildcards is the correct approach.

### 1.2 Multiple Fallback Selectors
**Current**: Defined in selectors like:
```typescript
this.rawMaterialsTableBody = page.locator(
  'tbody[id*="RawMaterials"][id*="LineItem"][id*="tblBody"], ' +
  'tbody[id*="RawMaterials::LineItem"][id*="tblBody"], ' +
  'table[id*="RawMaterials"] tbody'
);
```
**Why this works**: Different SAP versions/patches may have different ID patterns.

### 1.3 Locator Properties in Constructor
**Current**: All locators defined in constructor
**Why this works**: Centralizes selectors, easy to update.

---

## 2. ISSUES & IMPROVEMENTS NEEDED 🔴

### 2.1 INCONSISTENT SELECTOR PATTERNS

**Problem**: Different pages use different patterns
```typescript
// LoginPage (OK for non-SAP, but not following SAP pattern)
this.usernameInput = page.locator('#username');

// StyleMasterCreate (SAP pattern with wildcards)
this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');

// VendorCreate (Mixed approach)
this.vendorCodeDisplay = page.locator('[id*="DataField::code::Field-display"], [id*="DataField::Code::Field-display"]');
```

**Recommendation**: Create a **Base Page Object Class** with utility methods for SAP selectors:

```typescript
// src/pages/BasePage.ts
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * SAP Selector Helper - creates wildcard selector for dynamic IDs
   * @param fieldName - SAP field name (e.g., "Departments", "VendorCode")
   * @param prefix - Optional prefix (default: "DataField")
   * @param suffix - Optional suffix (default: "")
   */
  sapSelector(fieldName: string, prefix: string = 'DataField', suffix: string = ''): string {
    return `[id*="${prefix}::${fieldName}${suffix}"]`;
  }

  /**
   * Create locator with SAP selector pattern
   */
  sapLocator(fieldName: string, prefix: string = 'DataField', suffix: string = ''): Locator {
    return this.page.locator(this.sapSelector(fieldName, prefix, suffix));
  }

  /**
   * Safe wait for locator with error handling
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      throw new Error(`Timeout waiting for element: ${error.message}`);
    }
  }

  /**
   * Click with retry logic for SAP UI5
   */
  async clickWithRetry(locator: Locator, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await locator.click();
        await this.page.waitForLoadState('networkidle');
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Get element count safely
   */
  async getElementCount(locator: Locator): Promise<number> {
    try {
      return await locator.count();
    } catch {
      return 0;
    }
  }
}
```

**Apply to StyleMasterCreate.ts**:
```typescript
export class StyleMasterCreate extends BasePage {
  readonly departmentsValueHelpButton: Locator;
  readonly customerValueHelpButton: Locator;
  // ... etc

  constructor(page: Page) {
    super(page);
    
    // Now use helper method instead of hardcoding
    this.departmentsValueHelpButton = this.sapLocator('Departments', 'DataField', '::Field-edit-inner-vhi');
    this.customerValueHelpButton = this.sapLocator('Customer', 'DataField', '::Field-edit-inner-vhi');
    // ... etc
  }
}
```

---

### 2.2 INCONSISTENT METHOD NAMING & ORGANIZATION

**Problem**: Methods follow different naming patterns:
```typescript
// Inconsistent patterns
clickDepartmentsValueHelp()        // click + field + action
selectDepartmentByRoutingPlan()    // select + entity + criteria
waitForDropdownLoad()              // wait + component
clickCustomerValueHelp()           // click + field + action
selectRandomMerchandiser()         // select + entity + behavior
```

**Recommendation**: Establish naming convention:

```typescript
/**
 * NAMING CONVENTION FOR SAP PAGE OBJECTS
 * 
 * Format: [action][Field/Component][Qualifier]
 * 
 * Actions:
 *   click - interact with button/link
 *   fill - input text/data
 *   select - choose from dropdown/list
 *   wait - wait for element visibility
 *   get - retrieve value/text
 *   is - check boolean state
 * 
 * Field/Component: SAP field name (PascalCase)
 * Qualifier: Optional context (ByName, ByCode, First, Random, etc.)
 */

// ✅ GOOD - Consistent naming
async clickValueHelpButton(fieldName: string): Promise<void> {
  const button = this.page.locator(`span[id*="${fieldName}::Field-edit-inner-vhi"]`);
  await this.clickWithRetry(button);
}

async selectFromDropdown(fieldName: string, value: string): Promise<void> {
  const row = this.page.locator(`tr[role="row"]:has(span:text("${value}"))`);
  await row.click();
}

async fillInputField(fieldName: string, value: string): Promise<void> {
  const input = this.sapLocator(fieldName, 'DataField', '::Field-edit-inner');
  await input.fill(value);
}

async waitForElement(fieldName: string, timeout: number = 10000): Promise<void> {
  const locator = this.sapLocator(fieldName);
  await locator.waitFor({ state: 'visible', timeout });
}

async getFieldValue(fieldName: string): Promise<string> {
  const input = this.sapLocator(fieldName, 'DataField', '::Field-edit-inner');
  return await input.inputValue();
}
```

---

### 2.3 MISSING ABSTRACTION FOR DROPDOWN/TABLE INTERACTIONS

**Problem**: Dropdown logic is repeated in multiple methods:
```typescript
// Method 1
async selectDepartmentByRoutingPlan(routingPlanName: string) {
  const matchingRow = this.departmentsTableBody.locator(
    `tr[role="row"]:has(span:text("${routingPlanName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}

// Method 2 (same pattern, different names)
async selectCustomerByName(customerName: string) {
  const matchingRow = this.customerTableBody.locator(
    `tr[role="row"]:has(span:text("${customerName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}
```

**Recommendation**: Create reusable helper methods:

```typescript
/**
 * Generic dropdown table helper
 */
async selectTableRowByText(tableBodyLocator: Locator, searchText: string): Promise<void> {
  const matchingRow = tableBodyLocator.locator(
    `tr[role="row"]:has(span:text("${searchText}"))`
  );
  
  if (await matchingRow.count() === 0) {
    throw new Error(`Row with text "${searchText}" not found in table`);
  }
  
  await matchingRow.first().click();
  await this.page.waitForLoadState('networkidle');
}

async selectTableRowByIndex(tableBodyLocator: Locator, index: number): Promise<void> {
  const row = tableBodyLocator.locator('tr[role="row"]').nth(index);
  await row.click();
  await this.page.waitForLoadState('networkidle');
}

async selectRandomTableRow(tableBodyLocator: Locator): Promise<number> {
  const allRows = tableBodyLocator.locator('tr[role="row"]');
  const rowCount = await allRows.count();
  
  if (rowCount === 0) {
    throw new Error('No rows found in table');
  }
  
  const randomIndex = Math.floor(Math.random() * rowCount);
  await allRows.nth(randomIndex).click();
  await this.page.waitForLoadState('networkidle');
  
  return randomIndex;
}

// Now simplify the specific methods:
async selectDepartmentByRoutingPlan(routingPlanName: string): Promise<void> {
  await this.selectTableRowByText(this.departmentsTableBody, routingPlanName);
}

async selectCustomerByName(customerName: string): Promise<void> {
  await this.selectTableRowByText(this.customerTableBody, customerName);
}
```

---

### 2.4 MISSING WAIT STATE CONSISTENCY

**Problem**: Different timeout values and wait strategies used:
```typescript
await this.page.waitForLoadState('networkidle');    // sometimes
await this.page.waitForTimeout(500);                 // sometimes
await this.page.waitForTimeout(2000);                // sometimes
// No consistency!
```

**Recommendation**: Define wait constants in BasePage:

```typescript
// src/pages/BasePage.ts
export class BasePage {
  // Wait timeouts for SAP UI5 (in milliseconds)
  protected readonly WAIT_TIMEOUT_SHORT = 1000;      // For quick interactions
  protected readonly WAIT_TIMEOUT_MEDIUM = 5000;     // For normal waits
  protected readonly WAIT_TIMEOUT_LONG = 15000;      // For heavy operations
  protected readonly WAIT_TIMEOUT_VERY_LONG = 30000; // For form loads

  // Standard wait strategies
  protected readonly WAIT_NETWORKIDLE = 'networkidle';
  protected readonly WAIT_DOMCONTENTLOADED = 'domcontentloaded';

  // SAP-specific waits
  async waitForSAPFormLoad(): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(500); // Extra time for SAP UI5 rendering
  }

  async waitForSAPDropdownLoad(): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(500);
  }

  async waitForSAPTableLoad(): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(300);
  }
}
```

Use in methods:
```typescript
async selectDepartmentByRoutingPlan(routingPlanName: string): Promise<void> {
  await this.selectTableRowByText(this.departmentsTableBody, routingPlanName);
  await this.waitForSAPFormLoad();  // Clear, consistent wait
}
```

---

### 2.5 MISSING ERROR HANDLING & LOGGING

**Problem**: No consistent error messages or logging:
```typescript
async selectRandomCustomer() {
  const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  const rowCount = await allRows.count();

  if (rowCount === 0) {
    throw new Error('No customer rows found in the customer dialog table');
  }
  // ...
}
```

**Recommendation**: Add logging helper:

```typescript
// src/pages/BasePage.ts
export class BasePage {
  protected logAction(action: string, details: string = ''): void {
    const timestamp = new Date().toLocaleTimeString();
    const msg = details ? `[${timestamp}] ${action} → ${details}` : `[${timestamp}] ${action}`;
    console.log(msg);
  }

  protected logError(error: string, context: string = ''): void {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ERROR: ${error}${context ? ` (${context})` : ''}`);
  }
}
```

Use it:
```typescript
async selectRandomCustomer(): Promise<number> {
  const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  const rowCount = await allRows.count();

  if (rowCount === 0) {
    this.logError('No customer rows found', 'selectRandomCustomer');
    throw new Error('No customer rows found in customer dialog');
  }

  const randomIndex = Math.floor(Math.random() * rowCount);
  await allRows.nth(randomIndex).click();
  
  this.logAction('Customer selected', `Random index: ${randomIndex}`);
  await this.waitForSAPFormLoad();
  
  return randomIndex;
}
```

---

### 2.6 MISSING TYPE SAFETY & INTERFACES

**Problem**: No types defined for return values:
```typescript
async selectRandomMerchandiser() {
  // What does this return? No type hint
  // ...
}
```

**Recommendation**: Create types/interfaces:

```typescript
// src/types/SelectionResult.ts
export interface SelectionResult {
  success: boolean;
  selectedValue: string;
  selectedIndex: number;
  message: string;
}

export interface DropdownAction {
  tableBodyLocator: Locator;
  searchCriteria: 'text' | 'index' | 'random';
  value?: string;
  index?: number;
  timeout?: number;
}

export interface FormFillResult {
  fieldName: string;
  value: string;
  success: boolean;
  errorMessage?: string;
}
```

Use in methods:
```typescript
async selectRandomMerchandiser(): Promise<SelectionResult> {
  const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  const rowCount = await allRows.count();

  if (rowCount === 0) {
    return {
      success: false,
      selectedValue: '',
      selectedIndex: -1,
      message: 'No rows found'
    };
  }

  const randomIndex = Math.floor(Math.random() * rowCount);
  const rowText = await allRows.nth(randomIndex).textContent() || '';
  
  await allRows.nth(randomIndex).click();
  await this.waitForSAPFormLoad();

  return {
    success: true,
    selectedValue: rowText.trim(),
    selectedIndex: randomIndex,
    message: 'Merchandiser selected successfully'
  };
}
```

---

## 3. ARCHITECTURE RECOMMENDATIONS

### 3.1 Proposed File Structure
```
src/
├── pages/
│   ├── BasePage.ts                 ← NEW: Base class with helpers
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── StyleMaster/
│   │   ├── StyleMasterPage.ts      (list/navigation)
│   │   └── StyleMasterCreate.ts    (form creation)
│   ├── Vendor/
│   │   ├── VendorPage.ts
│   │   └── VendorCreate.ts
│   └── ...
├── types/                           ← NEW: Type definitions
│   ├── SelectionResult.ts
│   ├── FormFillResult.ts
│   └── SAPElements.ts
├── utils/                           ← NEW: Utility functions
│   ├── SAPSelectors.ts             (selector helpers)
│   ├── WaitStrategies.ts           (wait helpers)
│   └── ErrorHandling.ts            (error helpers)
└── ...
```

### 3.2 Separation of Concerns
- **Page Classes**: Only UI interaction
- **Type Files**: Data structures
- **Utils**: Reusable logic (selectors, waits, errors)

---

## 4. SPECIFIC IMPROVEMENTS TO IMPLEMENT NOW

### Priority 1: High Impact
1. ✅ Create `BasePage.ts` with helper methods
2. ✅ Create `types/` folder with interfaces
3. ✅ Refactor `StyleMasterCreate.ts` to extend BasePage
4. ✅ Add consistent error handling & logging

### Priority 2: Medium Impact
5. ✅ Define wait constants
6. ✅ Consolidate dropdown selection logic
7. ✅ Add type hints to all methods

### Priority 3: Nice to Have
8. ✅ Create selector utility class
9. ✅ Add test data builder classes
10. ✅ Create POM documentation

---

## 5. QUICK WIN EXAMPLE

Convert this:
```typescript
async selectDepartmentByRoutingPlan(routingPlanName: string) {
  const matchingRow = this.departmentsTableBody.locator(
    `tr[role="row"]:has(span:text("${routingPlanName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}

async selectCustomerByName(customerName: string) {
  const matchingRow = this.customerTableBody.locator(
    `tr[role="row"]:has(span:text("${customerName}"))`
  );
  await matchingRow.click();
  await this.page.waitForLoadState('networkidle');
}
```

To this:
```typescript
async selectDepartmentByRoutingPlan(routingPlanName: string): Promise<void> {
  this.logAction('Selecting department', routingPlanName);
  await this.selectTableRowByText(this.departmentsTableBody, routingPlanName);
  await this.waitForSAPFormLoad();
}

async selectCustomerByName(customerName: string): Promise<void> {
  this.logAction('Selecting customer', customerName);
  await this.selectTableRowByText(this.customerTableBody, customerName);
  await this.waitForSAPFormLoad();
}
```

---

## 6. NEXT STEPS

1. Create `BasePage.ts` in `src/pages/`
2. Create `src/types/` directory with interfaces
3. Refactor existing POMs to extend BasePage
4. Add method return types and error handling
5. Test with existing regression tests

Would you like me to implement these improvements? I can start with creating the BasePage and types.
