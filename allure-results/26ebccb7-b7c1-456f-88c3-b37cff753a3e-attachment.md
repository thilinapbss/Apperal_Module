# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:690:7

# Error details

```
Error: locator.click: Target crashed 
Call log:
  - waiting for locator('button[id$="::FooterBar::StandardAction::Save"]')

```

# Test source

```ts
  17  |     this.departmentsInput = page.locator('input[id*="DataField::Departments::Field-edit-inner-inner"]');
  18  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  19  |     this.styleMasterCodeDisplay = page.locator('[id*="DataField::code::Field-display"], [id*="DataField::Code::Field-display"]');
  20  |     this.saveButton = page.locator('button[id$="::FooterBar::StandardAction::Save"]');
  21  |   }
  22  | 
  23  |   async waitForFormLoad() {
  24  |     // Wait for any form field to load (code, name, or departments)
  25  |     try {
  26  |       await this.styleMasterCodeInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  27  |       return;
  28  |     } catch {}
  29  | 
  30  |     try {
  31  |       await this.styleMasterNameInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  32  |       return;
  33  |     } catch {}
  34  | 
  35  |     try {
  36  |       await this.departmentsInput.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  37  |       return;
  38  |     } catch {}
  39  | 
  40  |     throw new Error('No form fields found on Style Master create page');
  41  |   }
  42  | 
  43  |   async fillStyleMasterCode(code: string) {
  44  |     const input = this.styleMasterCodeInput;
  45  |     try {
  46  |       await input.waitFor({ state: 'visible', timeout: 5000 });
  47  |       await input.fill(code);
  48  |     } catch {
  49  |       console.log('Code field not found or not visible');
  50  |     }
  51  |   }
  52  | 
  53  |   async fillStyleMasterName(name: string) {
  54  |     const input = this.styleMasterNameInput;
  55  |     try {
  56  |       await input.waitFor({ state: 'visible', timeout: 5000 });
  57  |       await input.fill(name);
  58  |     } catch {
  59  |       console.log('Name field not found or not visible');
  60  |     }
  61  |   }
  62  | 
  63  |   async fillDepartments(department: string) {
  64  |     try {
  65  |       // Wait for departments input
  66  |       await this.departmentsInput.waitFor({ state: 'visible', timeout: 10000 });
  67  | 
  68  |       // Click value help button to open dropdown
  69  |       await this.departmentsValueHelpButton.click();
  70  |       await this.page.waitForLoadState('networkidle');
  71  |       await this.page.waitForTimeout(800);
  72  | 
  73  |       // Wait for dropdown table to appear
  74  |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  75  |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  76  |       await this.page.waitForTimeout(500);
  77  | 
  78  |       // Find and click the department option in the table
  79  |       const departmentRow = this.page.locator(`//span[text()="${department}"]/ancestor::tr[@role="row"]`).first();
  80  |       await departmentRow.click();
  81  |       await this.page.waitForLoadState('networkidle');
  82  |       await this.page.waitForTimeout(500);
  83  |     } catch (error) {
  84  |       console.log(`Could not fill departments field: ${error}`);
  85  |     }
  86  |   }
  87  | 
  88  |   async captureAndSaveFormData(filePath: string) {
  89  |     const fs = require('fs');
  90  |     const path = require('path');
  91  | 
  92  |     // Capture style master form data
  93  |     const styleMasterCode = await this.styleMasterCodeInput.inputValue().catch(() => '');
  94  |     const styleMasterName = await this.styleMasterNameInput.inputValue().catch(() => '');
  95  |     const departments = await this.departmentsInput.inputValue().catch(() => '');
  96  | 
  97  |     // Create the data structure
  98  |     const formData = {
  99  |       styleMasterCode: styleMasterCode.trim(),
  100 |       styleMasterName: styleMasterName.trim(),
  101 |       departments: departments.trim()
  102 |     };
  103 | 
  104 |     // Ensure directory exists
  105 |     const dir = path.dirname(filePath);
  106 |     if (!fs.existsSync(dir)) {
  107 |       fs.mkdirSync(dir, { recursive: true });
  108 |     }
  109 | 
  110 |     // Save to file with UTF-8 encoding without BOM
  111 |     const jsonString = JSON.stringify(formData, null, 2);
  112 |     fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });
  113 |     console.log(`Style Master data captured and saved to ${filePath}`);
  114 |   }
  115 | 
  116 |   async clickSaveButton() {
> 117 |     await this.saveButton.click();
      |                           ^ Error: locator.click: Target crashed 
  118 |     await this.page.waitForLoadState('networkidle');
  119 |   }
  120 | }
  121 | 
```