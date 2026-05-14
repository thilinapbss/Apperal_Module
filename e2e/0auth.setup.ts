import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForLoginForm();
  await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
  await loginPage.waitForNavigation();
  await page.locator('#shell-header').waitFor({ state: 'visible', timeout: 90000 });
  await page.context().storageState({ path: authFile });
});
