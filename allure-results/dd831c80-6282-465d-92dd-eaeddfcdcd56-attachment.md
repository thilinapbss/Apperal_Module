# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 33. Click Create button in Routing Plan
- Location: e2e\apparel_regression_testing.spec.ts:551:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[id*="RoutingPlans::LineItem::StandardAction::Create"]') to be visible

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class RoutingPlanPage {
  4  |   readonly page: Page;
  5  |   readonly createButton: Locator;
  6  |   readonly routingPlanNameInput: Locator;
  7  |   readonly statusInput: Locator;
  8  |   readonly saveButton: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.createButton = page.locator('button[id*="RoutingPlans::LineItem::StandardAction::Create"]');
  13 |     this.routingPlanNameInput = page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  14 |     this.statusInput = page.locator('input[id*="Status::Field-edit-inner-inner"]');
  15 |     this.saveButton = page.locator('button[id*="RoutingPlansObjectPage--fe::FooterBar"][id*="StandardAction::Save"]');
  16 |   }
  17 | 
  18 |   async waitForPageLoad() {
> 19 |     await this.createButton.waitFor({ state: 'visible', timeout: 30000 });
     |                             ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  20 |   }
  21 | 
  22 |   async clickCreateButton() {
  23 |     await this.createButton.click();
  24 |     await this.page.waitForLoadState('networkidle');
  25 |   }
  26 | 
  27 |   async waitForCreateFormLoad() {
  28 |     await this.routingPlanNameInput.waitFor({ state: 'visible', timeout: 30000 });
  29 |   }
  30 | 
  31 |   async fillRoutingPlanName(name: string) {
  32 |     await this.routingPlanNameInput.fill(name);
  33 |   }
  34 | 
  35 |   async fillStatus(status: string) {
  36 |     await this.statusInput.fill(status);
  37 |   }
  38 | 
  39 |   async clickSaveButton() {
  40 |     await this.saveButton.click();
  41 |     await this.page.waitForLoadState('networkidle');
  42 |   }
  43 | }
  44 | 
```