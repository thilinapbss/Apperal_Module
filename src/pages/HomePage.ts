import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly dashboardSection: Locator;
  readonly dashboardGroups: Locator;

  readonly merchandisingGroup: Locator;
  readonly productionGroup: Locator;
  readonly otherGroup: Locator;
  readonly mastersGroup: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardSection = page.locator('#sapUshellDashboardPage-cont');
    this.dashboardGroups  = page.locator('#dashboardGroups');

    this.merchandisingGroup = page.locator('.lp-group-container[data-group="merchandising"]');
    this.productionGroup    = page.locator('.lp-group-container[data-group="production"]');
    this.otherGroup         = page.locator('.lp-group-container[data-group="other"]');
    this.mastersGroup       = page.locator('.lp-group-container[data-group="other1"]');
  }

  groupHeader(group: Locator): Locator {
    return group.locator('.lp-group-header');
  }

  tile(group: Locator, title: string): Locator {
    return group.locator('.lp-group-tiles').getByRole('link', { name: `${title} Tile`, exact: true });
  }

  async waitForDashboard() {
    await this.dashboardSection.waitFor({ state: 'visible', timeout: 90000 });
    await this.dashboardGroups.waitFor({ state: 'visible', timeout: 90000 });
  }

  async clickRoutingPlanTile() {
    const routingPlanTile = this.tile(this.mastersGroup, 'Routing Plan');
    await routingPlanTile.click();
  }

  async clickVendorMerchandiserTile() {
    const vendorTile = this.page.locator('a[href*="apperalvendor-display"]');
    await vendorTile.click();
  }

  async clickSubMasterBranchTile() {
    const subMasterBranchTile = this.page.locator('a[href*="apperalsubmasterbranch-display"]');
    await subMasterBranchTile.click();
  }
}
