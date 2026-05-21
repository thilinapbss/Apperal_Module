import { Page, Locator } from '@playwright/test';

export class RoutingPlanPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly routingPlanNameInput: Locator;
  readonly statusInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.locator('button[id*="RoutingPlans::LineItem::StandardAction::Create"]');
    this.routingPlanNameInput = page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
    this.statusInput = page.locator('input[id*="Status::Field-edit-inner-inner"]');
    this.saveButton = page.locator('button[id*="RoutingPlansObjectPage--fe::FooterBar"][id*="StandardAction::Save"]');
  }

  async waitForPageLoad() {
    await this.createButton.waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickCreateButton() {
    await this.createButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForCreateFormLoad() {
    await this.routingPlanNameInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async fillRoutingPlanName(name: string) {
    await this.routingPlanNameInput.fill(name);
  }

  async fillStatus(status: string) {
    await this.statusInput.fill(status);
  }

  async clickSaveButton() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
