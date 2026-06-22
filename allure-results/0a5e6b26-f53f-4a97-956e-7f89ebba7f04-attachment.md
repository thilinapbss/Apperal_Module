# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 08. TC-BPO-005 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:369:10

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button').filter({ hasText: 'Excel Upload' }).first()
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('button').filter({ hasText: 'Excel Upload' }).first()

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
    - region "My Home"
    - list:
      - listitem:
        - link "Number Series Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#teav1numberserial-display
          - text: Number Series Number Series 🔢
      - listitem:
        - link "Buyer PO Upload Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalbuyerpoupload-display
          - text: Buyer PO Upload Buyer PO Upload 📤
      - listitem:
        - link "Segment Master Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalsegmentmaster-display
          - text: Segment Master Segment Master 📊
      - listitem:
        - link "Season Selection Submaster Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalseasonselectionsubmaster-display
          - text: Season Selection Submaster Season Selection Submaster
      - listitem:
        - link "Routing Plan Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalroutingplan-display
          - text: Routing Plan Routing Plan 🛣️
      - listitem:
        - link "Bill Of Material Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperal_2e_billofmaterial-open
          - text: Bill Of Material Bill Of Material 📑
      - listitem:
        - link "Trim Allocation Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperaltrimallocation-display
          - text: Trim Allocation Trim Allocation ✂️
      - listitem:
        - link "Cost Sheet Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalcostsheet-display
          - text: Cost Sheet Cost Sheet 💰
      - listitem:
        - link "Master Plan Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalmasterplan-display
          - text: Master Plan Master Plan 📅
      - listitem:
        - link "Work In Progress Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalworkinginprogress-display
          - text: Work In Progress Work In Progress
      - listitem:
        - link "Lay Sheet Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperallaysheet-display
          - text: Lay Sheet Lay Sheet 📐
      - listitem:
        - link "Vendor Merchandiser Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalvendor-display
          - text: Vendor Merchandiser Vendor Merchandiser
      - listitem:
        - link "Gantt Chart Dashboard Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperal_2e_ganttchart-open
          - text: Gantt Chart Dashboard Gantt Chart 📊
      - listitem:
        - link "Style Master Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalstylemaster-display
          - text: Style Master Style Master 👗
      - listitem:
        - link "Count Barcode Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalitemcodegeneration-display
          - text: Count Barcode Count Barcode
      - listitem:
        - link "QC Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalqc-display
          - text: QC QC ✅
      - listitem:
        - link "Inspection Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalinspection-display
          - text: Inspection Inspection 🔍
      - listitem:
        - link "Inspection Checklist Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalinspectionchecklist-display
          - text: Inspection Checklist Inspection Checklist
      - listitem:
        - link "Sub Master Branch Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalsubmasterbranch-display
          - text: Sub Master Branch Sub master branch 🏢
      - listitem:
        - link "UDO Creation Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperaludocreation-display
          - text: UDO Creation UDO Creation 📝
      - listitem:
        - link "Cartoons Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalcartoons-display
          - text: Cartoons Cartoons 📦
      - listitem:
        - link "ERP Post Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalerppost-display
          - text: ERP Post ERP Post
      - listitem:
        - link "User & Role Management Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperaladmin-display
          - text: User & Role Management User & Role Management
      - listitem:
        - link "Approval Stage Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalapprovalstage-display
          - text: Approval Stage Approval Stage
      - listitem:
        - link "Approval Template Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperal-approvaltemplate-display
          - text: Approval Template Approval Template
      - listitem:
        - link "Notification Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalnotification-display
          - text: Notification Notification
      - listitem:
        - link "Inventory Transfer Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalinventorytransfer-display
          - text: Inventory Transfer Good Issue and Good Receipt
      - listitem:
        - link "Bar Code Generator Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalbarcodegenerator-display
          - text: Bar Code Generator Bar Code Generator 🔲
      - listitem:
        - link "Production Order Tile":
          - /url: http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalproductionorder-display
          - text: Production Order Production Order
- contentinfo
- button "Pending Approval Requests":
  - img
- img
- text: System Administrator
- img
```