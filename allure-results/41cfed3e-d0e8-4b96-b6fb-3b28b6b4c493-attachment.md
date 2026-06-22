# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 04. TC-DSH-001: Dashboard loads with all tile groups
- Location: e2e\apparel_regression_testing.spec.ts:258:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.lp-group-container[data-group="merchandising"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('.lp-group-container[data-group="merchandising"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })

```

```yaml
- status
- status
- banner "Shell Bar":
  - button "SAP Logo":
    - img "SAP Logo"
  - heading "Home" [level=1]
  - button "Home"
  - button "Profile of System Administrator": SA
- main "Shell Content":
  - region "Tile Groups":
    - region "My Home": Menu
    - list:
      - listitem "Tile Approval Template Tile":
        - link "Approval Template Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperal-approvaltemplate-display
          - text: Approval Template Approval Template
- contentinfo
- button "Pending Approval Requests":
  - img
- img
- text: System Administrator
- img
```