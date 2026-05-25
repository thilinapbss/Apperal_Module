# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:742:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('tbody[id*="Branch::Popover"][id*="tblBody"]').locator('tr[role="row"]:has(span:text("BR002"))')
    - locator resolved to <tr role="row" tabindex="-1" aria-rowindex="2" data-sap-ui-render="" aria-selected="false" id="__item55-__clone342" data-sap-ui="__item55-__clone342" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeActive sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMListTblRow">…</tr>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    47 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  109 |     // Click the first row in the dropdown table
  110 |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  111 |     await firstRow.click();
  112 |     await this.page.waitForLoadState('networkidle');
  113 |   }
  114 | 
  115 |   async clickCustomerValueHelp() {
  116 |     await this.customerValueHelpButton.click();
  117 |     await this.page.waitForLoadState('networkidle');
  118 |   }
  119 | 
  120 |   async waitForCustomerDropdownLoad() {
  121 |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
  122 |     await this.page.waitForTimeout(2000);
  123 |   }
  124 | 
  125 |   async selectCustomerByName(customerName: string) {
  126 |     // Find the row containing the customer name and click it
  127 |     const matchingRow = this.customerTableBody.locator(
  128 |       `tr[role="row"]:has(span:text("${customerName}"))`
  129 |     );
  130 |     await matchingRow.click();
  131 |     await this.page.waitForLoadState('networkidle');
  132 |   }
  133 | 
  134 |   async selectFirstCustomer() {
  135 |     // Click the first row in the dropdown table
  136 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  137 |     await firstRow.click();
  138 |     await this.page.waitForLoadState('networkidle');
  139 |   }
  140 | 
  141 |   async selectRandomCustomer() {
  142 |     // Wait for at least one row to be available in the customer table
  143 |     const firstRow = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]').first();
  144 |     await firstRow.waitFor({ state: 'attached', timeout: 15000 });
  145 |     await this.page.waitForTimeout(2000);
  146 | 
  147 |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  148 |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  149 |     const rowCount = await allRows.count();
  150 | 
  151 |     if (rowCount === 0) {
  152 |       throw new Error('No customer rows found in the customer dialog table');
  153 |     }
  154 | 
  155 |     // Select a random row (0 to rowCount-1)
  156 |     const randomIndex = Math.floor(Math.random() * rowCount);
  157 |     const randomRow = allRows.nth(randomIndex);
  158 | 
  159 |     // Click on the first cell in the row instead of the row itself to avoid table overlay
  160 |     const firstCell = randomRow.locator('td').first();
  161 |     await firstCell.click();
  162 |     await this.page.waitForLoadState('networkidle');
  163 |     console.log(`Selected customer at random index: ${randomIndex}`);
  164 |   }
  165 | 
  166 |   async clickMerchandiserValueHelp() {
  167 |     await this.merchandiserValueHelpButton.click();
  168 |     await this.page.waitForLoadState('networkidle');
  169 |   }
  170 | 
  171 |   async waitForMerchandiserDropdownLoad() {
  172 |     await this.merchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  173 |     await this.page.waitForTimeout(2000);
  174 |   }
  175 | 
  176 |   async selectRandomMerchandiser() {
  177 |     // Get all merchandiser rows from the SuggestTable in the popover
  178 |     const allRows = this.merchandiserTableBody.locator('tr[role="row"]');
  179 |     const rowCount = await allRows.count();
  180 | 
  181 |     if (rowCount === 0) {
  182 |       throw new Error('No merchandiser rows found in the dropdown table');
  183 |     }
  184 | 
  185 |     // Select a random row (0 to rowCount-1)
  186 |     const randomIndex = Math.floor(Math.random() * rowCount);
  187 |     const randomRow = allRows.nth(randomIndex);
  188 | 
  189 |     await randomRow.click();
  190 |     await this.page.waitForLoadState('networkidle');
  191 |     console.log(`Selected merchandiser at random index: ${randomIndex}`);
  192 |   }
  193 | 
  194 |   async clickBranchValueHelp() {
  195 |     await this.branchValueHelpButton.click();
  196 |     await this.page.waitForLoadState('networkidle');
  197 |   }
  198 | 
  199 |   async waitForBranchDropdownLoad() {
  200 |     await this.branchTableBody.waitFor({ state: 'attached', timeout: 10000 });
  201 |     await this.page.waitForTimeout(500);
  202 |   }
  203 | 
  204 |   async selectBranchByCode(branchCode: string) {
  205 |     // Find the row containing the branch code and click it
  206 |     const matchingRow = this.branchTableBody.locator(
  207 |       `tr[role="row"]:has(span:text("${branchCode}"))`
  208 |     );
> 209 |     await matchingRow.click();
      |                       ^ Error: locator.click: Target page, context or browser has been closed
  210 |     await this.page.waitForLoadState('networkidle');
  211 |   }
  212 | 
  213 |   async clickVendorMerchandiserValueHelp() {
  214 |     await this.vendorMerchandiserValueHelpButton.click();
  215 |     await this.page.waitForLoadState('networkidle');
  216 |   }
  217 | 
  218 |   async waitForVendorMerchandiserDropdownLoad() {
  219 |     await this.vendorMerchandiserTableBody.waitFor({ state: 'attached', timeout: 10000 });
  220 |     await this.page.waitForTimeout(500);
  221 |   }
  222 | 
  223 |   async selectVendorMerchandiserByName(vendorName: string) {
  224 |     // Find the row containing the vendor name and click it
  225 |     const matchingRow = this.vendorMerchandiserTableBody.locator(
  226 |       `tr[role="row"]:has(span:text("${vendorName}"))`
  227 |     );
  228 |     await matchingRow.click();
  229 |     await this.page.waitForLoadState('networkidle');
  230 |   }
  231 | 
  232 |   async clickSegmentCodeValueHelp() {
  233 |     await this.segmentCodeValueHelpButton.click();
  234 |     await this.page.waitForLoadState('networkidle');
  235 |   }
  236 | 
  237 |   async waitForSegmentCodeDropdownLoad() {
  238 |     await this.segmentCodeTableBody.waitFor({ state: 'attached', timeout: 10000 });
  239 |     await this.page.waitForTimeout(500);
  240 |   }
  241 | 
  242 |   async selectSegmentCodeByCode(segmentCode: string) {
  243 |     // Find the row containing the segment code and click it
  244 |     const matchingRow = this.segmentCodeTableBody.locator(
  245 |       `tr[role="row"]:has(span:text("${segmentCode}"))`
  246 |     );
  247 |     await matchingRow.click();
  248 |     await this.page.waitForLoadState('networkidle');
  249 |   }
  250 | 
  251 |   async clickPackingSegmentValueHelp() {
  252 |     await this.packingSegmentValueHelpButton.click();
  253 |     await this.page.waitForLoadState('networkidle');
  254 |   }
  255 | 
  256 |   async waitForPackingSegmentDropdownLoad() {
  257 |     await this.packingSegmentTableBody.waitFor({ state: 'attached', timeout: 10000 });
  258 |     await this.page.waitForTimeout(500);
  259 |   }
  260 | 
  261 |   async selectPackingSegmentByCode(segmentCode: string) {
  262 |     // Find the row containing the segment code and click it
  263 |     const matchingRow = this.packingSegmentTableBody.locator(
  264 |       `tr[role="row"]:has(span:text("${segmentCode}"))`
  265 |     );
  266 |     await matchingRow.click();
  267 |     await this.page.waitForLoadState('networkidle');
  268 |   }
  269 | 
  270 |   async fillConsiderPacking(value: string) {
  271 |     await this.considerPackingInput.fill(value);
  272 |     await this.page.waitForLoadState('networkidle');
  273 |   }
  274 | 
  275 |   async fillVCP(value: string) {
  276 |     await this.page.evaluate(() => window.scrollBy(0, 500));
  277 |     await this.page.waitForTimeout(500);
  278 | 
  279 |     try {
  280 |       await this.vcpInput.waitFor({ state: 'visible', timeout: 5000 });
  281 |       await this.vcpInput.fill(value);
  282 |     } catch (e) {
  283 |       // Try alternative locator patterns
  284 |       const alternativeSelectors = [
  285 |         'input[id*="VCP"]',
  286 |         'input[placeholder*="VCP"]',
  287 |         'input[aria-label*="VCP"]',
  288 |         'input[id*="DataField::VendorCertificationProfile"]',
  289 |         'input[id*="DataField::Vcp"]'
  290 |       ];
  291 | 
  292 |       let found = false;
  293 |       for (const selector of alternativeSelectors) {
  294 |         try {
  295 |           const element = this.page.locator(selector).first();
  296 |           const count = await element.count();
  297 |           if (count > 0) {
  298 |             console.log(`Found VCP field using selector: ${selector}`);
  299 |             await element.fill(value);
  300 |             found = true;
  301 |             break;
  302 |           }
  303 |         } catch {
  304 |           continue;
  305 |         }
  306 |       }
  307 | 
  308 |       if (!found) {
  309 |         console.error('VCP field not found with any selector. Available alternatives tried.');
```