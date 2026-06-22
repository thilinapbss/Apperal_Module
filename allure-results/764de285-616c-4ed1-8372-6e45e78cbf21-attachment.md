# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 12. TC-BPO-002: Verify Buyer PO Upload page loaded
- Location: e2e\apparel_regression_testing.spec.ts:123:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('h1, .sapMTitle, [role="heading"]').first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1, .sapMTitle, [role="heading"]').first()
    21 × locator resolved to <h1 aria-level="1" class="sapUiPseudoInvisibleText">Buyer PO Upload</h1>
       - unexpected value "hidden"

```

```yaml
- status
- status
- banner "Shell Bar":
  - button "Back": 
  - button "SAP Logo":
    - img "SAP Logo"
  - heading "Buyer PO Upload" [level=1]
  - button "Buyer PO Upload"
  - button "Profile of System Administrator": SA
- main "Shell Content":
  - article:
    - button "Standard" [expanded]
    - region "Expanded header":
      - searchbox
      - text: Editing Status
      - combobox "Editing Status": All
      - button "Show Value Help": 
      - button "Go"
      - button "Adapt Filters (1)"
      - button "Collapse Header"
      - button "Pin Header"
    - toolbar "Buyer PO Uploads (2)":
      - heading "Buyer PO Uploads (2)" [level=3]
      - button "Submit for Approval" [disabled]
      - button "Create"
      - button "Delete" [disabled]
      - separator
      - listbox:
        - option "Show More per Row"
        - option "Show Less per Row" [selected]
      - button "Settings"
      - group "Export Table Split Button Press Enter to trigger action and Arrow Down to open menu":
        - button "excel-attachment"
        - button "Open Menu"
    - grid "Buyer PO Uploads (2)":
      - rowgroup:
        - row "Selection Supplier Code  PO Date Style No Season Status Row Action":
          - columnheader "Selection":
            - checkbox "Select all rows"
          - columnheader "Supplier Code "
          - columnheader "PO Date"
          - columnheader "Style No"
          - columnheader "Season"
          - columnheader "Status"
          - columnheader "Row Action"
      - rowgroup:
        - row "Item Selection CS002 Jun 7, 2026 0002 - BES_STY11 Season 001 Active Navigation":
          - gridcell "Item Selection":
            - checkbox "Item Selection"
          - gridcell "CS002"
          - gridcell "Jun 7, 2026"
          - gridcell "0002 - BES_STY11"
          - gridcell "Season 001"
          - gridcell "Active"
          - gridcell "Navigation":
            - img "Navigation": 
        - row "Item Selection Sumanasiri Jun 5, 2026 1015 - BESPP1012 SS25 PH02 Active Navigation":
          - gridcell "Item Selection":
            - checkbox "Item Selection"
          - gridcell "Sumanasiri"
          - gridcell "Jun 5, 2026"
          - gridcell "1015 - BESPP1012"
          - gridcell "SS25 PH02"
          - gridcell "Active"
          - gridcell "Navigation":
            - img "Navigation": 
- contentinfo
- button "Pending Approval Requests":
  - img
- img
- text: System Administrator
- img
```