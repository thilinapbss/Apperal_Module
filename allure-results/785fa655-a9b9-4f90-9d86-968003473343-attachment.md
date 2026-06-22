# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 06. TC-BPO-003 -	Table displays correct columns	User is on Buyer PO Upload list page
- Location: e2e\apparel_regression_testing.spec.ts:300:11

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('.lp-group-container[data-group="merchandising"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })
    - locator resolved to <a role="link" id="__tile1" tabindex="-1" draggable="false" data-sap-ui="__tile1" data-sap-ui-render="" title="Buyer PO Upload" rel="noopener noreferrer" aria-label="Buyer PO Upload↵Tile" class="sapMGT sapMGTStateLoaded sapMGTScopeDisplay OneByOne sapMPointer sapMGTHeaderMode" href="http://kgntest.ddns.net:4005/launchpadPage.html?sap-ushell-config=lean#apperalbuyerpoupload-display">…</a>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action
    - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="sapUshellDashboardPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="sapUshellDashboardPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="sapUshellDashboardPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="sapUshellDashboardPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    32 × element is not visible
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
    - element is not visible
  - retrying click action
    - waiting 500ms

```