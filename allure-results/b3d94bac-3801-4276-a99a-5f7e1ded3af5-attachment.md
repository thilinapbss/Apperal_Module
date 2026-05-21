# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:702:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('tbody[id*="SuggestTable-tblBody"]')

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
  29  |   readonly poNumberValueHelpButton: Locator;
  30  |   readonly poNumberDialog: Locator;
  31  |   readonly poNumberTable: Locator;
  32  |   readonly poNumberTableBody: Locator;
  33  | 
  34  |   constructor(page: Page) {
  35  |     this.page = page;
  36  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  37  |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  38  |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  39  |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  40  |     this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog::qualifier"]');
  41  |     this.customerTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  42  |     this.merchandiserValueHelpButton = page.locator('span[id*="DataField::Merchandiser::Field-edit-inner-vhi"]');
  43  |     this.merchandiserDialog = page.locator('div[id*="FieldValueHelp::Merchandiser::Popover"]');
  44  |     this.merchandiserTableBody = page.locator('tbody[id*="Merchandiser::Popover"][id*="tblBody"]');
  45  |     this.branchValueHelpButton = page.locator('span[id*="DataField::Branch::Field-edit-inner-vhi"]');
  46  |     this.branchPopover = page.locator('div[id*="FieldValueHelp::Branch::Popover"]');
  47  |     this.branchTableBody = page.locator('tbody[id*="Branch::Popover"][id*="tblBody"]');
  48  |     this.vendorMerchandiserValueHelpButton = page.locator('span[id*="DataField::VendorMerchandiser::Field-edit-inner-vhi"]');
  49  |     this.vendorMerchandiserPopover = page.locator('div[id*="FieldValueHelp::VendorMerchandiser::Popover"]');
  50  |     this.vendorMerchandiserTableBody = page.locator('tbody[id*="VendorMerchandiser::Popover"][id*="tblBody"]');
  51  |     this.segmentCodeValueHelpButton = page.locator('span[id*="DataField::SegmentCode::Field-edit-inner-vhi"]');
  52  |     this.segmentCodePopover = page.locator('div[id*="FieldValueHelp::SegmentCode::Popover"]');
  53  |     this.segmentCodeTableBody = page.locator('tbody[id*="SegmentCode::Popover"][id*="tblBody"]');
  54  |     this.packingSegmentValueHelpButton = page.locator('span[id*="DataField::PackingSegment::Field-edit-inner-vhi"]');
  55  |     this.packingSegmentPopover = page.locator('div[id*="FieldValueHelp::PackingSegment::Popover"]');
  56  |     this.packingSegmentTableBody = page.locator('tbody[id*="PackingSegment::Popover"][id*="tblBody"]');
  57  |     this.considerPackingInput = page.locator('input[id*="DataField::PackBaseUnit::Field-edit-inner-inner"]');
  58  |     this.vcpInput = page.locator('input[id*="DataField::VCP::Field-edit-inner-inner"]');
  59  |     this.makeInput = page.locator('input[id*="DataField::Make::Field-edit-inner-inner"]');
  60  |     this.poNumberValueHelpButton = page.locator('span[id*="PONumberSelection::PONumber::MultiValueField::_mvf-inner-vhi"]');
  61  |     this.poNumberDialog = page.locator('div[id*="Dialog"][role="dialog"]').filter({ hasText: 'PO Numbers' });
  62  |     this.poNumberTable = page.locator('table[id*="Table-innerTable-table"]');
  63  |     this.poNumberTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  64  |   }
  65  | 
  66  |   async waitForFormLoad() {
  67  |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
  68  |   }
  69  | 
  70  |   async clickDepartmentsValueHelp() {
  71  |     await this.departmentsValueHelpButton.click();
  72  |     await this.page.waitForLoadState('networkidle');
  73  |   }
  74  | 
  75  |   async waitForDropdownLoad() {
> 76  |     await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
      |                                     ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  77  |     await this.page.waitForTimeout(500);
  78  |   }
  79  | 
  80  |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  81  |     // Find the row containing the routing plan name and click it
  82  |     const matchingRow = this.departmentsTableBody.locator(
  83  |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  84  |     );
  85  |     await matchingRow.click();
  86  |     await this.page.waitForLoadState('networkidle');
  87  |   }
  88  | 
  89  |   async selectFirstDepartment() {
  90  |     // Click the first row in the dropdown table
  91  |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  92  |     await firstRow.click();
  93  |     await this.page.waitForLoadState('networkidle');
  94  |   }
  95  | 
  96  |   async clickCustomerValueHelp() {
  97  |     await this.customerValueHelpButton.click();
  98  |     await this.page.waitForLoadState('networkidle');
  99  |   }
  100 | 
  101 |   async waitForCustomerDropdownLoad() {
  102 |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
  103 |     await this.page.waitForTimeout(2000);
  104 |   }
  105 | 
  106 |   async selectCustomerByName(customerName: string) {
  107 |     // Find the row containing the customer name and click it
  108 |     const matchingRow = this.customerTableBody.locator(
  109 |       `tr[role="row"]:has(span:text("${customerName}"))`
  110 |     );
  111 |     await matchingRow.click();
  112 |     await this.page.waitForLoadState('networkidle');
  113 |   }
  114 | 
  115 |   async selectFirstCustomer() {
  116 |     // Click the first row in the dropdown table
  117 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  118 |     await firstRow.click();
  119 |     await this.page.waitForLoadState('networkidle');
  120 |   }
  121 | 
  122 |   async selectRandomCustomer() {
  123 |     // Wait for at least one row to be available in the customer table
  124 |     const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  125 |     await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  126 |     await this.page.waitForTimeout(2000);
  127 | 
  128 |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  129 |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  130 |     const rowCount = await allRows.count();
  131 | 
  132 |     if (rowCount === 0) {
  133 |       throw new Error('No customer rows found in the customer dialog table');
  134 |     }
  135 | 
  136 |     // Select a random row (0 to rowCount-1)
  137 |     const randomIndex = Math.floor(Math.random() * rowCount);
  138 |     const randomRow = allRows.nth(randomIndex);
  139 | 
  140 |     // Click on the first cell in the row instead of the row itself to avoid table overlay
  141 |     const firstCell = randomRow.locator('td').first();
  142 |     await firstCell.click();
  143 |     await this.page.waitForLoadState('networkidle');
  144 |     console.log(`Selected customer at random index: ${randomIndex}`);
  145 |   }
  146 | 
  147 |   async clickMerchandiserValueHelp() {
  148 |     await this.merchandiserValueHelpButton.click();
  149 |     await this.page.waitForLoadState('networkidle');
  150 |   }
  151 | 
  152 |   async waitForMerchandiserDropdownLoad() {
  153 |     await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  154 |     await this.page.waitForTimeout(2000);
  155 |   }
  156 | 
  157 |   async selectRandomMerchandiser() {
  158 |     // Get all merchandiser rows from the SuggestTable in the popover
  159 |     const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  160 |     const rowCount = await allRows.count();
  161 | 
  162 |     if (rowCount === 0) {
  163 |       throw new Error('No merchandiser rows found in the dropdown table');
  164 |     }
  165 | 
  166 |     // Select a random row (0 to rowCount-1)
  167 |     const randomIndex = Math.floor(Math.random() * rowCount);
  168 |     const randomRow = allRows.nth(randomIndex);
  169 | 
  170 |     await randomRow.click();
  171 |     await this.page.waitForLoadState('networkidle');
  172 |     console.log(`Selected merchandiser at random index: ${randomIndex}`);
  173 |   }
  174 | 
  175 |   async clickBranchValueHelp() {
  176 |     await this.branchValueHelpButton.click();
```