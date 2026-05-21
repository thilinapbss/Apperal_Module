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
  - waiting for locator('div[id*="Dialog"][role="dialog"]').filter({ hasText: 'PO Numbers' }) to be visible

```

# Test source

```ts
  243 |     // Find the row containing the segment code and click it
  244 |     const matchingRow = this.packingSegmentTableBody.locator(
  245 |       `tr[role="row"]:has(span:text("${segmentCode}"))`
  246 |     );
  247 |     await matchingRow.click();
  248 |     await this.page.waitForLoadState('networkidle');
  249 |   }
  250 | 
  251 |   async fillConsiderPacking(value: string) {
  252 |     await this.considerPackingInput.fill(value);
  253 |     await this.page.waitForLoadState('networkidle');
  254 |   }
  255 | 
  256 |   async fillVCP(value: string) {
  257 |     await this.page.evaluate(() => window.scrollBy(0, 500));
  258 |     await this.page.waitForTimeout(500);
  259 | 
  260 |     try {
  261 |       await this.vcpInput.waitFor({ state: 'visible', timeout: 5000 });
  262 |       await this.vcpInput.fill(value);
  263 |     } catch (e) {
  264 |       // Try alternative locator patterns
  265 |       const alternativeSelectors = [
  266 |         'input[id*="VCP"]',
  267 |         'input[placeholder*="VCP"]',
  268 |         'input[aria-label*="VCP"]',
  269 |         'input[id*="DataField::VendorCertificationProfile"]',
  270 |         'input[id*="DataField::Vcp"]'
  271 |       ];
  272 | 
  273 |       let found = false;
  274 |       for (const selector of alternativeSelectors) {
  275 |         try {
  276 |           const element = this.page.locator(selector).first();
  277 |           const count = await element.count();
  278 |           if (count > 0) {
  279 |             console.log(`Found VCP field using selector: ${selector}`);
  280 |             await element.fill(value);
  281 |             found = true;
  282 |             break;
  283 |           }
  284 |         } catch {
  285 |           continue;
  286 |         }
  287 |       }
  288 | 
  289 |       if (!found) {
  290 |         console.error('VCP field not found with any selector. Available alternatives tried.');
  291 |         throw new Error(`Cannot find VCP input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
  292 |       }
  293 |     }
  294 | 
  295 |     await this.page.waitForLoadState('networkidle');
  296 |   }
  297 | 
  298 |   async fillMake(value: string) {
  299 |     await this.page.evaluate(() => window.scrollBy(0, 500));
  300 |     await this.page.waitForTimeout(500);
  301 | 
  302 |     try {
  303 |       await this.makeInput.waitFor({ state: 'visible', timeout: 5000 });
  304 |       await this.makeInput.fill(value);
  305 |     } catch (e) {
  306 |       const alternativeSelectors = [
  307 |         'input[id*="Make"]',
  308 |         'input[placeholder*="Make"]',
  309 |         'input[aria-label*="Make"]'
  310 |       ];
  311 | 
  312 |       let found = false;
  313 |       for (const selector of alternativeSelectors) {
  314 |         try {
  315 |           const element = this.page.locator(selector).first();
  316 |           const count = await element.count();
  317 |           if (count > 0) {
  318 |             console.log(`Found Make field using selector: ${selector}`);
  319 |             await element.fill(value);
  320 |             found = true;
  321 |             break;
  322 |           }
  323 |         } catch {
  324 |           continue;
  325 |         }
  326 |       }
  327 | 
  328 |       if (!found) {
  329 |         console.error('Make field not found with any selector.');
  330 |         throw new Error(`Cannot find Make input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
  331 |       }
  332 |     }
  333 | 
  334 |     await this.page.waitForLoadState('networkidle');
  335 |   }
  336 | 
  337 |   async clickPONumberValueHelp() {
  338 |     await this.poNumberValueHelpButton.click();
  339 |     await this.page.waitForLoadState('networkidle');
  340 |   }
  341 | 
  342 |   async waitForPONumberDialogLoad() {
> 343 |     await this.poNumberDialog.waitFor({ state: 'visible', timeout: 10000 });
      |                               ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  344 |     await this.page.waitForTimeout(500);
  345 |   }
  346 | 
  347 |   async selectPONumberByValue(poValue: string) {
  348 |     // Find the row containing the PO number value and click it
  349 |     const matchingRow = this.poNumberTableBody.locator(
  350 |       `tr[role="row"]:has(span:text("${poValue}"))`
  351 |     );
  352 |     await matchingRow.click();
  353 |     await this.page.waitForLoadState('networkidle');
  354 |   }
  355 | 
  356 |   async selectFirstPONumber() {
  357 |     // Click the first row in the PO number table
  358 |     const firstRow = this.poNumberTableBody.locator('tr[role="row"]').first();
  359 |     await firstRow.click();
  360 |     await this.page.waitForLoadState('networkidle');
  361 |   }
  362 | 
  363 |   async selectRandomPONumber() {
  364 |     // Get all PO number rows from the table
  365 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  366 |     const rowCount = await allRows.count();
  367 | 
  368 |     if (rowCount === 0) {
  369 |       throw new Error('No PO number rows found in the table');
  370 |     }
  371 | 
  372 |     // Select a random row (0 to rowCount-1)
  373 |     const randomIndex = Math.floor(Math.random() * rowCount);
  374 |     const randomRow = allRows.nth(randomIndex);
  375 | 
  376 |     await randomRow.click();
  377 |     await this.page.waitForLoadState('networkidle');
  378 |     console.log(`Selected PO number at random index: ${randomIndex}`);
  379 |   }
  380 | }
  381 | 
```