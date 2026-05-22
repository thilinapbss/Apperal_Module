# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 55. Verify all segmentNames and values from JSON are available in the web app
- Location: e2e\apparel_regression_testing.spec.ts:898:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://kgntest.ddns.net:4005/", waiting until "networkidle"

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
> 48  |     await this.page.goto('/', { waitUntil: 'networkidle' });
      |                     ^ Error: page.goto: Target page, context or browser has been closed
  49  |   }
  50  | 
  51  |   /**
  52  |    * Perform login with username and password
  53  |    */
  54  |   async login(username: string, password: string) {
  55  |     await this.usernameInput.fill(username);
  56  |     await this.passwordInput.fill(password);
  57  |     await this.loginButton.click();
  58  |   }
  59  | 
  60  |   /**
  61  |    * Fill username field
  62  |    */
  63  |   async fillUsername(username: string) {
  64  |     await this.usernameInput.fill(username);
  65  |   }
  66  | 
  67  |   /**
  68  |    * Fill password field
  69  |    */
  70  |   async fillPassword(password: string) {
  71  |     await this.passwordInput.fill(password);
  72  |   }
  73  | 
  74  |   /**
  75  |    * Click the login button
  76  |    */
  77  |   async clickLoginButton() {
  78  |     await this.loginButton.click();
  79  |   }
  80  | 
  81  |   /**
  82  |    * Get error message text
  83  |    */
  84  |   async getErrorMessage(): Promise<string> {
  85  |     await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  86  |     return await this.errorMessage.textContent() || '';
  87  |   }
  88  | 
  89  |   /**
  90  |    * Get success message text
  91  |    */
  92  |   async getSuccessMessage(): Promise<string> {
  93  |     await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
  94  |     return await this.successMessage.textContent() || '';
  95  |   }
  96  | 
  97  |   /**
  98  |    * Check if error message is visible
  99  |    */
  100 |   async isErrorMessageVisible(): Promise<boolean> {
  101 |     return await this.errorMessage.isVisible();
  102 |   }
  103 | 
  104 |   /**
  105 |    * Check if success message is visible
  106 |    */
  107 |   async isSuccessMessageVisible(): Promise<boolean> {
  108 |     return await this.successMessage.isVisible();
  109 |   }
  110 | 
  111 |   /**
  112 |    * Change password
  113 |    */
  114 |   async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  115 |     await this.currentPasswordInput.fill(currentPassword);
  116 |     await this.newPasswordInput.fill(newPassword);
  117 |     await this.confirmPasswordInput.fill(confirmPassword);
  118 |     await this.changePasswordButton.click();
  119 |   }
  120 | 
  121 |   /**
  122 |    * Check if login form is visible
  123 |    */
  124 |   async isLoginFormVisible(): Promise<boolean> {
  125 |     return await this.loginForm.isVisible();
  126 |   }
  127 | 
  128 |   /**
  129 |    * Check if change password form is visible
  130 |    */
  131 |   async isChangePasswordFormVisible(): Promise<boolean> {
  132 |     return await this.changePasswordForm.isVisible();
  133 |   }
  134 | 
  135 |   /**
  136 |    * Wait for login form to be visible
  137 |    */
  138 |   async waitForLoginForm() {
  139 |     await this.loginForm.waitFor({ state: 'visible', timeout: 90000 });
  140 |   }
  141 | 
  142 |   /**
  143 |    * Wait for navigation after login
  144 |    */
  145 |   async waitForNavigation() {
  146 |     await this.page.waitForLoadState('networkidle');
  147 |   }
  148 | 
```