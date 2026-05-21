# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('input[role="combobox"]').first()
    - locator resolved to <input value="All" type="text" role="combobox" autocomplete="off" aria-expanded="false" aria-haspopup="listbox" aria-autocomplete="both" class="sapMInputBaseInner" id="apperal.routingplan::RoutingPlansList--fe::FilterBar::RoutingPlans::FilterField::DraftEditingStatus-inner-inner"/>
    - fill("WH-CMB")
  - attempting fill action
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and editable
      - element is not visible
    - retrying fill action
      - waiting 100ms
    46 × waiting for element to be visible, enabled and editable
       - element is not visible
     - retrying fill action
       - waiting 500ms

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class RoutingPlanCreate {
  4  |   readonly page: Page;
  5  |   readonly createDetailButton: Locator;
  6  | 
  7  |   constructor(page: Page) {
  8  |     this.page = page;
  9  |     this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  10 |   }
  11 | 
  12 |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string }[]) {
  13 |     for (let i = 0; i < details.length; i++) {
  14 |       await this.createDetailButton.click();
  15 |       await this.page.waitForLoadState('networkidle');
  16 |       await this.page.waitForTimeout(2000);
  17 | 
  18 |       // Use .last() to target the most recently created inputs
  19 |       const codeInput = this.page.locator("xpath=//input[@aria-labelledby='__label10']").first();      const nameInput = this.page.locator('xpath=(//input)[15]').last();
  20 |       const warehouseInput = this.page.locator('input[role="combobox"]').first();
  21 | 
  22 |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  23 |       await this.page.keyboard.press('Tab');
  24 | 
  25 |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  26 |       await this.page.keyboard.press('Tab');
  27 | 
> 28 |       await warehouseInput.fill(details[i].warehouse);
     |                            ^ Error: locator.fill: Target page, context or browser has been closed
  29 |       await this.page.waitForTimeout(500);
  30 | 
  31 |       // Click value help button
  32 |       const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  33 |       await valueHelpButton.click();
  34 |       await this.page.waitForLoadState('networkidle');
  35 |       await this.page.waitForTimeout(800);
  36 | 
  37 |       // Select from dropdown
  38 |       await this.page.waitForLoadState('networkidle');
  39 |       await this.page.waitForTimeout(500);
  40 | 
  41 |       console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  42 |     }
  43 |   }
  44 | }
  45 | 
```