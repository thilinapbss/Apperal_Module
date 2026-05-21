# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('text="WH-CMB"').first()
    - locator resolved to <span class="sapMInputHighlight">WH-CMB</span>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    9 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
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
  19 |       const codeInput = this.page.locator('xpath=(//input)[14]').last();
  20 |       const nameInput = this.page.locator('xpath=(//input)[15]').last();
  21 |       const warehouseInput = this.page.locator('input[role="combobox"]').last();
  22 | 
  23 |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  24 |       await this.page.keyboard.press('Tab');
  25 | 
  26 |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  27 |       await this.page.keyboard.press('Tab');
  28 | 
  29 |       await warehouseInput.fill(details[i].warehouse);
  30 |       await this.page.waitForTimeout(500);
  31 | 
  32 |       // Click value help button
  33 |       const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  34 |       await valueHelpButton.click();
  35 |       await this.page.waitForLoadState('networkidle');
  36 |       await this.page.waitForTimeout(800);
  37 | 
  38 |       // Select from dropdown
  39 |       const warehouseOption = this.page.locator(`text="${details[i].warehouse}"`).first();
> 40 |       await warehouseOption.click();
     |                             ^ Error: locator.click: Target page, context or browser has been closed
  41 |       await this.page.waitForLoadState('networkidle');
  42 |       await this.page.waitForTimeout(500);
  43 | 
  44 |       console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  45 |     }
  46 |   }
  47 | }
  48 | 
```