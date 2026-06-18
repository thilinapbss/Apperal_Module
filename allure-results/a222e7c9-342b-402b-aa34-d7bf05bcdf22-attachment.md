# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:744:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]') to be visible

```

# Test source

```ts
  7   |   readonly departmentsDropdownTable: Locator;
  8   |   readonly departmentsTableBody: Locator;
  9   |   readonly customerValueHelpButton: Locator;
  10  |   readonly customerDialog: Locator;
  11  |   readonly customerTableBody: Locator;
  12  |   readonly merchandiserValueHelpButton: Locator;
  13  |   readonly merchandiserDialog: Locator;
  14  |   readonly merchandiserTableBody: Locator;
  15  |   readonly branchValueHelpButton: Locator;
  16  |   readonly branchPopover: Locator;
  17  |   readonly branchTableBody: Locator;
  18  |   readonly vendorMerchandiserValueHelpButton: Locator;
  19  |   readonly vendorMerchandiserPopover: Locator;
  20  |   readonly vendorMerchandiserTableBody: Locator;
  21  |   readonly segmentCodeValueHelpButton: Locator;
  22  |   readonly segmentCodePopover: Locator;
  23  |   readonly segmentCodeTableBody: Locator;
  24  |   readonly packingSegmentValueHelpButton: Locator;
  25  |   readonly packingSegmentPopover: Locator;
  26  |   readonly packingSegmentTableBody: Locator;
  27  |   readonly considerPackingInput: Locator;
  28  |   readonly vcpInput: Locator;
  29  |   readonly makeInput: Locator;
  30  |   readonly poNumberValueHelpButton: Locator;
  31  |   readonly poNumberDialog: Locator;
  32  |   readonly poNumberTable: Locator;
  33  |   readonly poNumberTableBody: Locator;
  34  |   readonly poNumberOkButton: Locator;
  35  |   readonly priceInput: Locator;
  36  |   readonly referenceInput: Locator;
  37  |   readonly seasonSelectionInput: Locator;
  38  |   readonly styleColorInput: Locator;
  39  |   readonly styleStatusInput: Locator;
  40  |   readonly attachmentDetailsCreateButton: Locator;
  41  |   readonly attachmentDetailsTable: Locator;
  42  |   readonly attachmentDetailsTableBody: Locator;
  43  |   readonly rawMaterialsSection: Locator;
  44  |   readonly rawMaterialsCreateButton: Locator;
  45  |   readonly rawMaterialsTable: Locator;
  46  |   readonly rawMaterialsTableBody: Locator;
  47  |   readonly allocationHierarchySection: Locator;
  48  |   readonly allocationHierarchyTreeTable: Locator;
  49  |   readonly allocationHierarchyTableBody: Locator;
  50  | 
  51  |   constructor(page: Page) {
  52  |     this.page = page;
  53  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  54  |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  55  |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  56  |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  57  |     this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog::qualifier"]');
  58  |     this.customerTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  59  |     this.merchandiserValueHelpButton = page.locator('span[id*="DataField::Merchandiser::Field-edit-inner-vhi"]');
  60  |     this.merchandiserDialog = page.locator('div[id*="FieldValueHelp::Merchandiser::Popover"]');
  61  |     this.merchandiserTableBody = page.locator('tbody[id*="Merchandiser::Popover"][id*="tblBody"]');
  62  |     this.branchValueHelpButton = page.locator('span[id*="DataField::Branch::Field-edit-inner-vhi"]');
  63  |     this.branchPopover = page.locator('div[id*="FieldValueHelp::Branch::Popover"]');
  64  |     this.branchTableBody = page.locator('tbody[id*="Branch::Popover"][id*="tblBody"]');
  65  |     this.vendorMerchandiserValueHelpButton = page.locator('span[id*="DataField::VendorMerchandiser::Field-edit-inner-vhi"]');
  66  |     this.vendorMerchandiserPopover = page.locator('div[id*="FieldValueHelp::VendorMerchandiser::Popover"]');
  67  |     this.vendorMerchandiserTableBody = page.locator('tbody[id*="VendorMerchandiser::Popover"][id*="tblBody"]');
  68  |     this.segmentCodeValueHelpButton = page.locator('span[id*="DataField::SegmentCode::Field-edit-inner-vhi"]');
  69  |     this.segmentCodePopover = page.locator('div[id*="FieldValueHelp::SegmentCode::Popover"]');
  70  |     this.segmentCodeTableBody = page.locator('tbody[id*="SegmentCode::Popover"][id*="tblBody"]');
  71  |     this.packingSegmentValueHelpButton = page.locator('span[id*="DataField::PackingSegment::Field-edit-inner-vhi"]');
  72  |     this.packingSegmentPopover = page.locator('div[id*="FieldValueHelp::PackingSegment::Popover"]');
  73  |     this.packingSegmentTableBody = page.locator('tbody[id*="PackingSegment::Popover"][id*="tblBody"]');
  74  |     this.considerPackingInput = page.locator('input[id*="DataField::PackBaseUnit::Field-edit-inner-inner"]');
  75  |     this.vcpInput = page.locator('input[id*="DataField::VCP::Field-edit-inner-inner"]');
  76  |     this.makeInput = page.locator('input[id*="DataField::Make::Field-edit-inner-inner"]');
  77  |     this.poNumberValueHelpButton = page.locator('span[id*="PONumberSelection::PONumber::MultiValueField::_mvf-inner-vhi"]');
  78  |     this.poNumberDialog = page.locator('div[role="dialog"]').filter({ hasText: 'Select: PO Numbers' });
  79  |     this.poNumberTable = page.locator('table[id*="Table-innerTable-table"]');
  80  |     this.poNumberTableBody = page.locator('table[id*="Table-innerTable-table"] tbody');
  81  |     this.poNumberOkButton = page.locator('button[id*="-ok"]');
  82  |     this.priceInput = page.locator('input[id*="OtherInformation::price::Field-edit-inner"]');
  83  |     this.referenceInput = page.locator('input[id*="OtherInformation::Reference::Field-edit-inner"]');
  84  |     this.seasonSelectionInput = page.locator('input[id*="OtherInformation::seasonselection::Field-edit-inner"]');
  85  |     this.styleColorInput = page.locator('input[id*="OtherInformation::StyleColor::Field-edit-inner"]');
  86  |     this.styleStatusInput = page.locator('input[id*="OtherInformation::stylestatus::Field-edit-inner"]');
  87  |     this.attachmentDetailsCreateButton = page.locator('button[id*="AttachmentDetails::LineItem::StandardAction::Create"]');
  88  |     this.attachmentDetailsTable = page.locator('div[id*="AttachmentDetails::LineItem-innerTable-tableCtrlCnt"]');
  89  |     this.attachmentDetailsTableBody = page.locator('tbody[id*="AttachmentDetails::LineItem-innerTable-tblBody"], table[id*="AttachmentDetails::LineItem-innerTable-table"] tbody');
  90  |     this.rawMaterialsSection = page.locator('[id*="RawMaterials"]');
  91  |     // Raw Materials Create button is a BDI element, not a button
  92  |     this.rawMaterialsCreateButton = page.locator('[id*="RawMaterials::LineItem::RawMaterials::StandardAction::Create"]');
  93  |     this.rawMaterialsTable = page.locator('div[id*="RawMaterials::LineItem-innerTable-tableCtrlCnt"]');
  94  |     // Try multiple selector patterns for table body
  95  |     this.rawMaterialsTableBody = page.locator(
  96  |       'tbody[id*="RawMaterials"][id*="LineItem"][id*="tblBody"], ' +
  97  |       'tbody[id*="RawMaterials::LineItem-innerTable-tblBody"], ' +
  98  |       'table[id*="RawMaterials::LineItem-innerTable-table"] tbody, ' +
  99  |       'table[id*="RawMaterials"] tbody'
  100 |     );
  101 |     this.allocationHierarchySection = page.locator('section[id*="StyleTreeTable"]');
  102 |     this.allocationHierarchyTreeTable = page.locator('div[id*="CustomSubSection::StyleTreeTable--styleTreeTable"]');
  103 |     this.allocationHierarchyTableBody = page.locator('table[id*="StyleTreeTable--styleTreeTable-table"] tbody');
  104 |   }
  105 | 
  106 |   async waitForFormLoad() {
> 107 |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
      |                                           ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  108 |   }
  109 | 
  110 |   async clickDepartmentsValueHelp() {
  111 |     await this.departmentsValueHelpButton.click();
  112 |     await this.page.waitForLoadState('networkidle');
  113 |   }
  114 | 
  115 |   async waitForDropdownLoad() {
  116 |     await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
  117 |     await this.page.waitForTimeout(500);
  118 |   }
  119 | 
  120 |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  121 |     // Find the row containing the routing plan name and click it
  122 |     const matchingRow = this.departmentsTableBody.locator(
  123 |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  124 |     );
  125 |     await matchingRow.click();
  126 |     await this.page.waitForLoadState('networkidle');
  127 |   }
  128 | 
  129 |   async selectFirstDepartment() {
  130 |     // Click the first row in the dropdown table
  131 |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  132 |     await firstRow.click();
  133 |     await this.page.waitForLoadState('networkidle');
  134 |   }
  135 | 
  136 |   async clickCustomerValueHelp() {
  137 |     await this.customerValueHelpButton.click();
  138 |     await this.page.waitForLoadState('networkidle');
  139 |   }
  140 | 
  141 |   async waitForCustomerDropdownLoad() {
  142 |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
  143 |     await this.page.waitForTimeout(2000);
  144 |   }
  145 | 
  146 |   async selectCustomerByName(customerName: string) {
  147 |     // Find the row containing the customer name and click it
  148 |     const matchingRow = this.customerTableBody.locator(
  149 |       `tr[role="row"]:has(span:text("${customerName}"))`
  150 |     );
  151 |     await matchingRow.click();
  152 |     await this.page.waitForLoadState('networkidle');
  153 |   }
  154 | 
  155 |   async selectFirstCustomer() {
  156 |     // Click the first row in the dropdown table
  157 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  158 |     await firstRow.click();
  159 |     await this.page.waitForLoadState('networkidle');
  160 |   }
  161 | 
  162 |   async selectRandomCustomer() {
  163 |     // Wait for at least one row to be available in the customer table
  164 |     const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  165 |     await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  166 |     await this.page.waitForTimeout(2000);
  167 | 
  168 |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  169 |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  170 |     const rowCount = await allRows.count();
  171 | 
  172 |     if (rowCount === 0) {
  173 |       throw new Error('No customer rows found in the customer dialog table');
  174 |     }
  175 | 
  176 |     // Select a random row (0 to rowCount-1)
  177 |     const randomIndex = Math.floor(Math.random() * rowCount);
  178 |     const randomRow = allRows.nth(randomIndex);
  179 | 
  180 |     // Click on the first cell in the row instead of the row itself to avoid table overlay
  181 |     const firstCell = randomRow.locator('td').first();
  182 |     await firstCell.click();
  183 |     await this.page.waitForLoadState('networkidle');
  184 |     console.log(`Selected customer at random index: ${randomIndex}`);
  185 |   }
  186 | 
  187 |   async clickMerchandiserValueHelp() {
  188 |     await this.merchandiserValueHelpButton.click();
  189 |     await this.page.waitForLoadState('networkidle');
  190 |   }
  191 | 
  192 |   async waitForMerchandiserDropdownLoad() {
  193 |     await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  194 |     await this.page.waitForTimeout(2000);
  195 |   }
  196 | 
  197 |   async selectRandomMerchandiser() {
  198 |     // Get all merchandiser rows from the SuggestTable in the popover
  199 |     const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  200 |     const rowCount = await allRows.count();
  201 | 
  202 |     if (rowCount === 0) {
  203 |       throw new Error('No merchandiser rows found in the dropdown table');
  204 |     }
  205 | 
  206 |     // Select a random row (0 to rowCount-1)
  207 |     const randomIndex = Math.floor(Math.random() * rowCount);
```