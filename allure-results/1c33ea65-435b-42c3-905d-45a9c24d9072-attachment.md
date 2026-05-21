# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:702:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]') to be visible

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class StyleMasterCreate {
  4   |   readonly page: Page;
  5   |   readonly departmentsValueHelpButton: Locator;
  6   |   readonly departmentsDropdownTable: Locator;
  7   |   readonly departmentsTableBody: Locator;
  8   |   readonly customerValueHelpButton: Locator;
  9   |   readonly customerDialog: Locator;
  10  |   readonly customerTableBody: Locator;
  11  |   readonly merchandiserValueHelpButton: Locator;
  12  |   readonly merchandiserDialog: Locator;
  13  |   readonly merchandiserTableBody: Locator;
  14  |   readonly branchValueHelpButton: Locator;
  15  |   readonly branchPopover: Locator;
  16  |   readonly branchTableBody: Locator;
  17  |   readonly vendorMerchandiserValueHelpButton: Locator;
  18  |   readonly vendorMerchandiserPopover: Locator;
  19  |   readonly vendorMerchandiserTableBody: Locator;
  20  |   readonly segmentCodeValueHelpButton: Locator;
  21  |   readonly segmentCodePopover: Locator;
  22  |   readonly segmentCodeTableBody: Locator;
  23  |   readonly packingSegmentValueHelpButton: Locator;
  24  |   readonly packingSegmentPopover: Locator;
  25  |   readonly packingSegmentTableBody: Locator;
  26  |   readonly considerPackingInput: Locator;
  27  |   readonly vcpInput: Locator;
  28  |   readonly makeInput: Locator;
  29  | 
  30  |   constructor(page: Page) {
  31  |     this.page = page;
  32  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  33  |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  34  |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  35  |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  36  |     this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog::qualifier"]');
  37  |     this.customerTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  38  |     this.merchandiserValueHelpButton = page.locator('span[id*="DataField::Merchandiser::Field-edit-inner-vhi"]');
  39  |     this.merchandiserDialog = page.locator('div[id*="FieldValueHelp::Merchandiser::Popover"]');
  40  |     this.merchandiserTableBody = page.locator('tbody[id*="Merchandiser::Popover"][id*="tblBody"]');
  41  |     this.branchValueHelpButton = page.locator('span[id*="DataField::Branch::Field-edit-inner-vhi"]');
  42  |     this.branchPopover = page.locator('div[id*="FieldValueHelp::Branch::Popover"]');
  43  |     this.branchTableBody = page.locator('tbody[id*="Branch::Popover"][id*="tblBody"]');
  44  |     this.vendorMerchandiserValueHelpButton = page.locator('span[id*="DataField::VendorMerchandiser::Field-edit-inner-vhi"]');
  45  |     this.vendorMerchandiserPopover = page.locator('div[id*="FieldValueHelp::VendorMerchandiser::Popover"]');
  46  |     this.vendorMerchandiserTableBody = page.locator('tbody[id*="VendorMerchandiser::Popover"][id*="tblBody"]');
  47  |     this.segmentCodeValueHelpButton = page.locator('span[id*="DataField::SegmentCode::Field-edit-inner-vhi"]');
  48  |     this.segmentCodePopover = page.locator('div[id*="FieldValueHelp::SegmentCode::Popover"]');
  49  |     this.segmentCodeTableBody = page.locator('tbody[id*="SegmentCode::Popover"][id*="tblBody"]');
  50  |     this.packingSegmentValueHelpButton = page.locator('span[id*="DataField::PackingSegment::Field-edit-inner-vhi"]');
  51  |     this.packingSegmentPopover = page.locator('div[id*="FieldValueHelp::PackingSegment::Popover"]');
  52  |     this.packingSegmentTableBody = page.locator('tbody[id*="PackingSegment::Popover"][id*="tblBody"]');
  53  |     this.considerPackingInput = page.locator('input[id*="DataField::PackBaseUnit::Field-edit-inner-inner"]');
  54  |     this.vcpInput = page.locator('input[id*="DataField::VCP::Field-edit-inner-inner"]');
  55  |     this.makeInput = page.locator('input[id*="DataField::Make::Field-edit-inner-inner"]');
  56  |   }
  57  | 
  58  |   async waitForFormLoad() {
> 59  |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
      |                                           ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  60  |   }
  61  | 
  62  |   async clickDepartmentsValueHelp() {
  63  |     await this.departmentsValueHelpButton.click();
  64  |     await this.page.waitForLoadState('networkidle');
  65  |   }
  66  | 
  67  |   async waitForDropdownLoad() {
  68  |     await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
  69  |     await this.page.waitForTimeout(500);
  70  |   }
  71  | 
  72  |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  73  |     // Find the row containing the routing plan name and click it
  74  |     const matchingRow = this.departmentsTableBody.locator(
  75  |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  76  |     );
  77  |     await matchingRow.click();
  78  |     await this.page.waitForLoadState('networkidle');
  79  |   }
  80  | 
  81  |   async selectFirstDepartment() {
  82  |     // Click the first row in the dropdown table
  83  |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  84  |     await firstRow.click();
  85  |     await this.page.waitForLoadState('networkidle');
  86  |   }
  87  | 
  88  |   async clickCustomerValueHelp() {
  89  |     await this.customerValueHelpButton.click();
  90  |     await this.page.waitForLoadState('networkidle');
  91  |   }
  92  | 
  93  |   async waitForCustomerDropdownLoad() {
  94  |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
  95  |     await this.page.waitForTimeout(2000);
  96  |   }
  97  | 
  98  |   async selectCustomerByName(customerName: string) {
  99  |     // Find the row containing the customer name and click it
  100 |     const matchingRow = this.customerTableBody.locator(
  101 |       `tr[role="row"]:has(span:text("${customerName}"))`
  102 |     );
  103 |     await matchingRow.click();
  104 |     await this.page.waitForLoadState('networkidle');
  105 |   }
  106 | 
  107 |   async selectFirstCustomer() {
  108 |     // Click the first row in the dropdown table
  109 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  110 |     await firstRow.click();
  111 |     await this.page.waitForLoadState('networkidle');
  112 |   }
  113 | 
  114 |   async selectRandomCustomer() {
  115 |     // Wait for at least one row to be available in the customer table
  116 |     const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  117 |     await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  118 |     await this.page.waitForTimeout(2000);
  119 | 
  120 |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  121 |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  122 |     const rowCount = await allRows.count();
  123 | 
  124 |     if (rowCount === 0) {
  125 |       throw new Error('No customer rows found in the customer dialog table');
  126 |     }
  127 | 
  128 |     // Select a random row (0 to rowCount-1)
  129 |     const randomIndex = Math.floor(Math.random() * rowCount);
  130 |     const randomRow = allRows.nth(randomIndex);
  131 | 
  132 |     // Click on the first cell in the row instead of the row itself to avoid table overlay
  133 |     const firstCell = randomRow.locator('td').first();
  134 |     await firstCell.click();
  135 |     await this.page.waitForLoadState('networkidle');
  136 |     console.log(`Selected customer at random index: ${randomIndex}`);
  137 |   }
  138 | 
  139 |   async clickMerchandiserValueHelp() {
  140 |     await this.merchandiserValueHelpButton.click();
  141 |     await this.page.waitForLoadState('networkidle');
  142 |   }
  143 | 
  144 |   async waitForMerchandiserDropdownLoad() {
  145 |     await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  146 |     await this.page.waitForTimeout(2000);
  147 |   }
  148 | 
  149 |   async selectRandomMerchandiser() {
  150 |     // Get all merchandiser rows from the SuggestTable in the popover
  151 |     const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  152 |     const rowCount = await allRows.count();
  153 | 
  154 |     if (rowCount === 0) {
  155 |       throw new Error('No merchandiser rows found in the dropdown table');
  156 |     }
  157 | 
  158 |     // Select a random row (0 to rowCount-1)
  159 |     const randomIndex = Math.floor(Math.random() * rowCount);
```