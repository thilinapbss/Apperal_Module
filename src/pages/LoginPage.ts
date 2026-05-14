import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Selectors
  readonly loginContainer: Locator;
  readonly loginForm: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  // Change Password Form Selectors
  readonly changePasswordForm: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;
  readonly passwordRequirements: Locator;

  constructor(page: Page) {
    this.page = page;

    // Login Form Elements
    this.loginContainer = page.locator('.login-container');
    this.loginForm = page.locator('#login-form');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-btn');
    this.errorMessage = page.locator('#error-msg');
    this.successMessage = page.locator('#success-msg');

    // Change Password Form Elements
    this.changePasswordForm = page.locator('#change-password-form');
    this.currentPasswordInput = page.locator('#current-password');
    this.newPasswordInput = page.locator('#new-password');
    this.confirmPasswordInput = page.locator('#confirm-password');
    this.changePasswordButton = page.locator('#change-btn');
    this.passwordRequirements = page.locator('.password-requirements');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Fill username field
   */
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    await this.loginButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.successMessage.textContent() || '';
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.changePasswordButton.click();
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginForm.isVisible();
  }

  /**
   * Check if change password form is visible
   */
  async isChangePasswordFormVisible(): Promise<boolean> {
    return await this.changePasswordForm.isVisible();
  }

  /**
   * Wait for login form to be visible
   */
  async waitForLoginForm() {
    await this.loginForm.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Wait for navigation after login
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if username input is focused
   */
  async isUsernameInputFocused(): Promise<boolean> {
    return await this.usernameInput.evaluate((el) => el === document.activeElement);
  }

  /**
   * Clear all form fields
   */
  async clearFormFields() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}
