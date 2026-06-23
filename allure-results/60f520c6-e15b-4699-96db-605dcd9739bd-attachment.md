# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10.  TC-BPO-002 Fill Routing Plan form
- Location: e2e\apparel_regression_testing.spec.ts:579:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class HomePage {
  4  |   readonly page: Page;
  5  | 
  6  |   readonly dashboardSection: Locator;
  7  |   readonly dashboardGroups: Locator;
  8  | 
  9  |   readonly merchandisingGroup: Locator;
  10 |   readonly productionGroup: Locator;
  11 |   readonly otherGroup: Locator;
  12 |   readonly mastersGroup: Locator;
  13 | 
  14 |   constructor(page: Page) {
  15 |     this.page = page;
  16 | 
  17 |     this.dashboardSection = page.locator('#sapUshellDashboardPage-cont');
  18 |     this.dashboardGroups  = page.locator('#dashboardGroups');
  19 | 
  20 |     this.merchandisingGroup = page.locator('.lp-group-container[data-group="merchandising"]');
  21 |     this.productionGroup    = page.locator('.lp-group-container[data-group="production"]');
  22 |     this.otherGroup         = page.locator('.lp-group-container[data-group="other"]');
  23 |     this.mastersGroup       = page.locator('.lp-group-container[data-group="other1"]');
  24 |   }
  25 | 
  26 |   groupHeader(group: Locator): Locator {
  27 |     return group.locator('.lp-group-header');
  28 |   }
  29 | 
  30 |   tile(group: Locator, title: string): Locator {
  31 |     return group.locator('.lp-group-tiles').getByRole('link', { name: `${title} Tile`, exact: true });
  32 |   }
  33 | 
  34 |   async waitForDashboard() {
  35 |     await this.dashboardSection.waitFor({ state: 'visible', timeout: 90000 });
  36 |     await this.dashboardGroups.waitFor({ state: 'visible', timeout: 90000 });
  37 |   }
  38 | 
  39 |   async clickRoutingPlanTile() {
  40 |     const routingPlanTile = this.tile(this.mastersGroup, 'Routing Plan');
> 41 |     await routingPlanTile.click();
     |                           ^ Error: locator.click: Target page, context or browser has been closed
  42 |   }
  43 | 
  44 |   async clickVendorMerchandiserTile() {
  45 |     const vendorTile = this.page.locator('a[href*="apperalvendor-display"]');
  46 |     await vendorTile.click();
  47 |   }
  48 | 
  49 |   async clickSubMasterBranchTile() {
  50 |     const subMasterBranchTile = this.page.locator('a[href*="apperalsubmasterbranch-display"]');
  51 |     await subMasterBranchTile.click();
  52 |   }
  53 | }
  54 | 
```