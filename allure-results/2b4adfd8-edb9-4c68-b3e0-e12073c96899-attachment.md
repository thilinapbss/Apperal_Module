# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:730:7

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
  33  |   readonly poNumberOkButton: Locator;
  34  | 
  35  |   constructor(page: Page) {
  36  |     this.page = page;
  37  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  38  |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  39  |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  40  |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  41  |     this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog::qualifier"]');
  42  |     this.customerTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  43  |     this.merchandiserValueHelpButton = page.locator('span[id*="DataField::Merchandiser::Field-edit-inner-vhi"]');
  44  |     this.merchandiserDialog = page.locator('div[id*="FieldValueHelp::Merchandiser::Popover"]');
  45  |     this.merchandiserTableBody = page.locator('tbody[id*="Merchandiser::Popover"][id*="tblBody"]');
  46  |     this.branchValueHelpButton = page.locator('span[id*="DataField::Branch::Field-edit-inner-vhi"]');
  47  |     this.branchPopover = page.locator('div[id*="FieldValueHelp::Branch::Popover"]');
  48  |     this.branchTableBody = page.locator('tbody[id*="Branch::Popover"][id*="tblBody"]');
  49  |     this.vendorMerchandiserValueHelpButton = page.locator('span[id*="DataField::VendorMerchandiser::Field-edit-inner-vhi"]');
  50  |     this.vendorMerchandiserPopover = page.locator('div[id*="FieldValueHelp::VendorMerchandiser::Popover"]');
  51  |     this.vendorMerchandiserTableBody = page.locator('tbody[id*="VendorMerchandiser::Popover"][id*="tblBody"]');
  52  |     this.segmentCodeValueHelpButton = page.locator('span[id*="DataField::SegmentCode::Field-edit-inner-vhi"]');
  53  |     this.segmentCodePopover = page.locator('div[id*="FieldValueHelp::SegmentCode::Popover"]');
  54  |     this.segmentCodeTableBody = page.locator('tbody[id*="SegmentCode::Popover"][id*="tblBody"]');
  55  |     this.packingSegmentValueHelpButton = page.locator('span[id*="DataField::PackingSegment::Field-edit-inner-vhi"]');
  56  |     this.packingSegmentPopover = page.locator('div[id*="FieldValueHelp::PackingSegment::Popover"]');
  57  |     this.packingSegmentTableBody = page.locator('tbody[id*="PackingSegment::Popover"][id*="tblBody"]');
  58  |     this.considerPackingInput = page.locator('input[id*="DataField::PackBaseUnit::Field-edit-inner-inner"]');
  59  |     this.vcpInput = page.locator('input[id*="DataField::VCP::Field-edit-inner-inner"]');
  60  |     this.makeInput = page.locator('input[id*="DataField::Make::Field-edit-inner-inner"]');
  61  |     this.poNumberValueHelpButton = page.locator('span[id*="PONumberSelection::PONumber::MultiValueField::_mvf-inner-vhi"]');
  62  |     this.poNumberDialog = page.locator('div[role="dialog"]').filter({ hasText: 'Select: PO Numbers' });
  63  |     this.poNumberTable = page.locator('table[id*="Table-innerTable-table"]');
  64  |     this.poNumberTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  65  |     this.poNumberOkButton = page.locator('button[id*="-ok"]');
  66  |   }
  67  | 
  68  |   async waitForFormLoad() {
  69  |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
  70  |   }
  71  | 
  72  |   async clickDepartmentsValueHelp() {
  73  |     await this.departmentsValueHelpButton.click();
  74  |     await this.page.waitForLoadState('networkidle');
  75  |   }
  76  | 
  77  |   async waitForDropdownLoad() {
> 78  |     await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
      |                                     ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  79  |     await this.page.waitForTimeout(500);
  80  |   }
  81  | 
  82  |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  83  |     // Find the row containing the routing plan name and click it
  84  |     const matchingRow = this.departmentsTableBody.locator(
  85  |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  86  |     );
  87  |     await matchingRow.click();
  88  |     await this.page.waitForLoadState('networkidle');
  89  |   }
  90  | 
  91  |   async selectFirstDepartment() {
  92  |     // Click the first row in the dropdown table
  93  |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  94  |     await firstRow.click();
  95  |     await this.page.waitForLoadState('networkidle');
  96  |   }
  97  | 
  98  |   async clickCustomerValueHelp() {
  99  |     await this.customerValueHelpButton.click();
  100 |     await this.page.waitForLoadState('networkidle');
  101 |   }
  102 | 
  103 |   async waitForCustomerDropdownLoad() {
  104 |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
  105 |     await this.page.waitForTimeout(2000);
  106 |   }
  107 | 
  108 |   async selectCustomerByName(customerName: string) {
  109 |     // Find the row containing the customer name and click it
  110 |     const matchingRow = this.customerTableBody.locator(
  111 |       `tr[role="row"]:has(span:text("${customerName}"))`
  112 |     );
  113 |     await matchingRow.click();
  114 |     await this.page.waitForLoadState('networkidle');
  115 |   }
  116 | 
  117 |   async selectFirstCustomer() {
  118 |     // Click the first row in the dropdown table
  119 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  120 |     await firstRow.click();
  121 |     await this.page.waitForLoadState('networkidle');
  122 |   }
  123 | 
  124 |   async selectRandomCustomer() {
  125 |     // Wait for at least one row to be available in the customer table
  126 |     const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  127 |     await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  128 |     await this.page.waitForTimeout(2000);
  129 | 
  130 |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  131 |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  132 |     const rowCount = await allRows.count();
  133 | 
  134 |     if (rowCount === 0) {
  135 |       throw new Error('No customer rows found in the customer dialog table');
  136 |     }
  137 | 
  138 |     // Select a random row (0 to rowCount-1)
  139 |     const randomIndex = Math.floor(Math.random() * rowCount);
  140 |     const randomRow = allRows.nth(randomIndex);
  141 | 
  142 |     // Click on the first cell in the row instead of the row itself to avoid table overlay
  143 |     const firstCell = randomRow.locator('td').first();
  144 |     await firstCell.click();
  145 |     await this.page.waitForLoadState('networkidle');
  146 |     console.log(`Selected customer at random index: ${randomIndex}`);
  147 |   }
  148 | 
  149 |   async clickMerchandiserValueHelp() {
  150 |     await this.merchandiserValueHelpButton.click();
  151 |     await this.page.waitForLoadState('networkidle');
  152 |   }
  153 | 
  154 |   async waitForMerchandiserDropdownLoad() {
  155 |     await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  156 |     await this.page.waitForTimeout(2000);
  157 |   }
  158 | 
  159 |   async selectRandomMerchandiser() {
  160 |     // Get all merchandiser rows from the SuggestTable in the popover
  161 |     const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  162 |     const rowCount = await allRows.count();
  163 | 
  164 |     if (rowCount === 0) {
  165 |       throw new Error('No merchandiser rows found in the dropdown table');
  166 |     }
  167 | 
  168 |     // Select a random row (0 to rowCount-1)
  169 |     const randomIndex = Math.floor(Math.random() * rowCount);
  170 |     const randomRow = allRows.nth(randomIndex);
  171 | 
  172 |     await randomRow.click();
  173 |     await this.page.waitForLoadState('networkidle');
  174 |     console.log(`Selected merchandiser at random index: ${randomIndex}`);
  175 |   }
  176 | 
  177 |   async clickBranchValueHelp() {
  178 |     await this.branchValueHelpButton.click();
```