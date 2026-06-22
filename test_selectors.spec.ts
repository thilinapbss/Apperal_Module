import { test } from '@playwright/test';

test('Check kimbleNo and remark field selectors', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForTimeout(2000);
  
  // Check if kimbleNo input exists
  const kimbleNoInputs = await page.locator('input[id*="KimbleNo"]').count();
  console.log(`Found ${kimbleNoInputs} kimbleNo inputs`);
  
  // Check all inputs with similar pattern
  const inputs = await page.locator('input[id*="Field-edit-inner"]').all();
  console.log(`Total input fields: ${inputs.length}`);
  
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    const ariaLabel = await input.getAttribute('aria-label');
    const placeholder = await input.getAttribute('placeholder');
    console.log(`Field: id="${id}", aria-label="${ariaLabel}", placeholder="${placeholder}"`);
  }
});
