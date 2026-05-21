# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:702:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('table[id*="Table-innerTable-table"] tbody').locator('tr[role="row"]').nth(3).locator('[role="gridcell"][class*="RowSelectionCell"]').first()

```

# Test source

```ts
  284 |             break;
  285 |           }
  286 |         } catch {
  287 |           continue;
  288 |         }
  289 |       }
  290 | 
  291 |       if (!found) {
  292 |         console.error('VCP field not found with any selector. Available alternatives tried.');
  293 |         throw new Error(`Cannot find VCP input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
  294 |       }
  295 |     }
  296 | 
  297 |     await this.page.waitForLoadState('networkidle');
  298 |   }
  299 | 
  300 |   async fillMake(value: string) {
  301 |     await this.page.evaluate(() => window.scrollBy(0, 500));
  302 |     await this.page.waitForTimeout(500);
  303 | 
  304 |     try {
  305 |       await this.makeInput.waitFor({ state: 'visible', timeout: 5000 });
  306 |       await this.makeInput.fill(value);
  307 |     } catch (e) {
  308 |       const alternativeSelectors = [
  309 |         'input[id*="Make"]',
  310 |         'input[placeholder*="Make"]',
  311 |         'input[aria-label*="Make"]'
  312 |       ];
  313 | 
  314 |       let found = false;
  315 |       for (const selector of alternativeSelectors) {
  316 |         try {
  317 |           const element = this.page.locator(selector).first();
  318 |           const count = await element.count();
  319 |           if (count > 0) {
  320 |             console.log(`Found Make field using selector: ${selector}`);
  321 |             await element.fill(value);
  322 |             found = true;
  323 |             break;
  324 |           }
  325 |         } catch {
  326 |           continue;
  327 |         }
  328 |       }
  329 | 
  330 |       if (!found) {
  331 |         console.error('Make field not found with any selector.');
  332 |         throw new Error(`Cannot find Make input field. Tried selectors: ${alternativeSelectors.join(', ')}`);
  333 |       }
  334 |     }
  335 | 
  336 |     await this.page.waitForLoadState('networkidle');
  337 |   }
  338 | 
  339 |   async clickPONumberValueHelp() {
  340 |     await this.poNumberValueHelpButton.click();
  341 |     await this.page.waitForLoadState('networkidle');
  342 |   }
  343 | 
  344 |   async waitForPONumberDialogLoad() {
  345 |     await this.poNumberDialog.waitFor({ state: 'attached', timeout: 10000 });
  346 |     await this.page.waitForTimeout(500);
  347 |   }
  348 | 
  349 |   async selectPONumberByValue(poValue: string) {
  350 |     // Find the row containing the PO number value and click its selector
  351 |     const matchingRow = this.poNumberTableBody.locator(
  352 |       `tr[role="row"]:has(span:text("${poValue}"))`
  353 |     );
  354 |     const rowSelector = matchingRow.locator('[role="gridcell"][class*="RowSelectionCell"]').first();
  355 |     await rowSelector.click();
  356 |     await this.poNumberOkButton.click();
  357 |     await this.page.waitForLoadState('networkidle');
  358 |   }
  359 | 
  360 |   async selectFirstPONumber() {
  361 |     // Get the first row and click its row selector
  362 |     const firstRow = this.poNumberTableBody.locator('tr[role="row"]').first();
  363 |     const rowSelector = firstRow.locator('[role="gridcell"][class*="RowSelectionCell"]').first();
  364 |     await rowSelector.click();
  365 |     await this.poNumberOkButton.click();
  366 |     await this.page.waitForLoadState('networkidle');
  367 |   }
  368 | 
  369 |   async selectRandomPONumber() {
  370 |     // Get all PO number rows from the table
  371 |     const allRows = this.poNumberTableBody.locator('tr[role="row"]');
  372 |     const rowCount = await allRows.count();
  373 | 
  374 |     if (rowCount === 0) {
  375 |       throw new Error('No PO number rows found in the table');
  376 |     }
  377 | 
  378 |     // Select a random row (0 to rowCount-1)
  379 |     const randomIndex = Math.floor(Math.random() * rowCount);
  380 |     const randomRow = allRows.nth(randomIndex);
  381 | 
  382 |     // Click the row selector for the selected row
  383 |     const rowSelector = randomRow.locator('[role="gridcell"][class*="RowSelectionCell"]').first();
> 384 |     await rowSelector.click();
      |                       ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  385 | 
  386 |     // Click the OK button to confirm selection
  387 |     await this.poNumberOkButton.click();
  388 |     await this.page.waitForLoadState('networkidle');
  389 |     console.log(`Selected PO number at random index: ${randomIndex}`);
  390 |   }
  391 | }
  392 | 
```