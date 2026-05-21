import { Page, Locator } from '@playwright/test';

export class VendorPage {
  readonly page: Page;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.locator('button[id*="Vendor::LineItem::StandardAction::Create"]');
  }

  async waitForPageLoad() {
    await this.createButton.waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickCreateButton() {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
