# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 01. Should display error message on invalid credentials
- Location: e2e\apparel_regression_testing.spec.ts:91:7

# Error details

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#username')

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class LoginPage {
  4   |   readonly page: Page;
  5   | 
  6   |   // Selectors
  7   |   readonly loginContainer: Locator;
  8   |   readonly loginForm: Locator;
  9   |   readonly usernameInput: Locator;
  10  |   readonly passwordInput: Locator;
  11  |   readonly loginButton: Locator;
  12  |   readonly errorMessage: Locator;
  13  |   readonly successMessage: Locator;
  14  | 
  15  |   // Change Password Form Selectors
  16  |   readonly changePasswordForm: Locator;
  17  |   readonly currentPasswordInput: Locator;
  18  |   readonly newPasswordInput: Locator;
  19  |   readonly confirmPasswordInput: Locator;
  20  |   readonly changePasswordButton: Locator;
  21  |   readonly passwordRequirements: Locator;
  22  | 
  23  |   constructor(page: Page) {
  24  |     this.page = page;
  25  | 
  26  |     // Login Form Elements
  27  |     this.loginContainer = page.locator('.login-container');
  28  |     this.loginForm = page.locator('#login-form');
  29  |     this.usernameInput = page.locator('#username');
  30  |     this.passwordInput = page.locator('#password');
  31  |     this.loginButton = page.locator('#login-btn');
  32  |     this.errorMessage = page.locator('#error-msg');
  33  |     this.successMessage = page.locator('#success-msg');
  34  | 
  35  |     // Change Password Form Elements
  36  |     this.changePasswordForm = page.locator('#change-password-form');
  37  |     this.currentPasswordInput = page.locator('#current-password');
  38  |     this.newPasswordInput = page.locator('#new-password');
  39  |     this.confirmPasswordInput = page.locator('#confirm-password');
  40  |     this.changePasswordButton = page.locator('#change-btn');
  41  |     this.passwordRequirements = page.locator('.password-requirements');
  42  |   }
  43  | 
  44  |   /**
  45  |    * Navigate to the login page
  46  |    */
  47  |   async goto() {
  48  |     await this.page.goto('/', { waitUntil: 'networkidle' });
  49  |   }
  50  | 
  51  |   /**
  52  |    * Perform login with username and password
  53  |    */
  54  |   async login(username: string, password: string) {
  55  | 
> 56  |     await this.usernameInput.fill(username);
      |                              ^ TimeoutError: locator.fill: Timeout 30000ms exceeded.
  57  |     await this.passwordInput.fill(password);
  58  |     await this.loginButton.click();
  59  |   }
  60  | 
  61  |   /**
  62  |    * Fill username field
  63  |    */
  64  |   async fillUsername(username: string) {
  65  |     await this.usernameInput.fill(username);
  66  |   }
  67  | 
  68  |   /**
  69  |    * Fill password field
  70  |    */
  71  |   async fillPassword(password: string) {
  72  |     await this.passwordInput.fill(password);
  73  |   }
  74  | 
  75  |   /**
  76  |    * Click the login button
  77  |    */
  78  |   async clickLoginButton() {
  79  |     await this.loginButton.click();
  80  |   }
  81  | 
  82  |   /**
  83  |    * Get error message text
  84  |    */
  85  |   async getErrorMessage(): Promise<string> {
  86  |     await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  87  |     return await this.errorMessage.textContent() || '';
  88  |   }
  89  | 
  90  |   /**
  91  |    * Get success message text
  92  |    */
  93  |   async getSuccessMessage(): Promise<string> {
  94  |     await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
  95  |     return await this.successMessage.textContent() || '';
  96  |   }
  97  | 
  98  |   /**
  99  |    * Check if error message is visible
  100 |    */
  101 |   async isErrorMessageVisible(): Promise<boolean> {
  102 |     return await this.errorMessage.isVisible();
  103 |   }
  104 | 
  105 |   /**
  106 |    * Check if success message is visible
  107 |    */
  108 |   async isSuccessMessageVisible(): Promise<boolean> {
  109 |     return await this.successMessage.isVisible();
  110 |   }
  111 | 
  112 |   /**
  113 |    * Change password
  114 |    */
  115 |   async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  116 |     await this.currentPasswordInput.fill(currentPassword);
  117 |     await this.newPasswordInput.fill(newPassword);
  118 |     await this.confirmPasswordInput.fill(confirmPassword);
  119 |     await this.changePasswordButton.click();
  120 |   }
  121 | 
  122 |   /**
  123 |    * Check if login form is visible
  124 |    */
  125 |   async isLoginFormVisible(): Promise<boolean> {
  126 |     return await this.loginForm.isVisible();
  127 |   }
  128 | 
  129 |   /**
  130 |    * Check if change password form is visible
  131 |    */
  132 |   async isChangePasswordFormVisible(): Promise<boolean> {
  133 |     return await this.changePasswordForm.isVisible();
  134 |   }
  135 | 
  136 |   /**
  137 |    * Wait for login form to be visible
  138 |    */
  139 |   async waitForLoginForm() {
  140 |     await this.loginForm.waitFor({ state: 'visible', timeout: 90000 });
  141 |   }
  142 | 
  143 |   /**
  144 |    * Wait for navigation after login
  145 |    */
  146 |   async waitForNavigation() {
  147 |     await this.page.waitForLoadState('networkidle');
  148 |   }
  149 | 
  150 |   /**
  151 |    * Check if username input is focused
  152 |    */
  153 |   async isUsernameInputFocused(): Promise<boolean> {
  154 |     return await this.usernameInput.evaluate((el) => el === document.activeElement);
  155 |   }
  156 | 
```