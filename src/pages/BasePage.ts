import { Page, Locator } from '@playwright/test';

/**
 * BasePage: Base class for all Page Objects
 * Provides common SAP UI5 interaction helpers, wait strategies, and logging
 */
export class BasePage {
  readonly page: Page;

  // Wait timeouts for SAP UI5 (in milliseconds)
  protected readonly WAIT_TIMEOUT_SHORT = 1000;        // Quick interactions (button clicks)
  protected readonly WAIT_TIMEOUT_MEDIUM = 5000;       // Normal waits (dropdowns)
  protected readonly WAIT_TIMEOUT_LONG = 15000;        // Heavy operations (form loads)
  protected readonly WAIT_TIMEOUT_VERY_LONG = 30000;   // Initial page loads

  // Standard wait strategies
  protected readonly WAIT_NETWORKIDLE = 'networkidle';
  protected readonly WAIT_DOMCONTENTLOADED = 'domcontentloaded';

  constructor(page: Page) {
    this.page = page;
  }

  // ============================================================================
  // LOGGING UTILITIES
  // ============================================================================

  /**
   * Log an action with timestamp
   * @param action - Action description
   * @param details - Additional details
   */
  protected logAction(action: string, details: string = ''): void {
    const timestamp = new Date().toLocaleTimeString();
    const msg = details ? `[${timestamp}] ✓ ${action} → ${details}` : `[${timestamp}] ✓ ${action}`;
    console.log(msg);
  }

  /**
   * Log a warning
   * @param warning - Warning message
   * @param context - Additional context
   */
  protected logWarning(warning: string, context: string = ''): void {
    const timestamp = new Date().toLocaleTimeString();
    console.warn(`[${timestamp}] ⚠ WARNING: ${warning}${context ? ` (${context})` : ''}`);
  }

  /**
   * Log an error
   * @param error - Error message
   * @param context - Additional context
   */
  protected logError(error: string, context: string = ''): void {
    const timestamp = new Date().toLocaleTimeString();
    console.error(`[${timestamp}] ✗ ERROR: ${error}${context ? ` (${context})` : ''}`);
  }

  // ============================================================================
  // SAP SELECTOR HELPERS
  // ============================================================================

  /**
   * Create a SAP selector string with wildcard pattern
   * Supports flexible ID matching for dynamic SAP UI5 IDs
   *
   * @param fieldName - SAP field name (e.g., "Departments", "VendorCode")
   * @param prefix - Optional prefix (default: "DataField")
   * @param suffix - Optional suffix
   * @returns CSS selector string with wildcard pattern
   *
   * @example
   * sapSelector('Departments') → '[id*="DataField::Departments"]'
   * sapSelector('Customer', 'DataField', '::Field-edit-inner-vhi') → '[id*="DataField::Customer::Field-edit-inner-vhi"]'
   */
  protected sapSelector(fieldName: string, prefix: string = 'DataField', suffix: string = ''): string {
    return `[id*="${prefix}::${fieldName}${suffix}"]`;
  }

  /**
   * Create a Locator using SAP selector pattern
   */
  protected sapLocator(fieldName: string, prefix: string = 'DataField', suffix: string = ''): Locator {
    return this.page.locator(this.sapSelector(fieldName, prefix, suffix));
  }

  /**
   * Create a SAP selector with data attributes
   * Useful for elements without predictable IDs
   *
   * @param dataAttribute - Data attribute name
   * @param value - Attribute value
   * @returns CSS selector string
   */
  protected sapDataSelector(dataAttribute: string, value: string): string {
    return `[data-sap-ui-${dataAttribute}="${value}"]`;
  }

  // ============================================================================
  // WAIT STRATEGIES FOR SAP UI5
  // ============================================================================

  /**
   * Wait for SAP form to fully load
   * Includes network idle + extra time for SAP rendering
   */
  protected async waitForSAPFormLoad(timeout: number = this.WAIT_TIMEOUT_VERY_LONG): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(500); // Extra time for SAP UI5 rendering
    this.logAction('Form load complete');
  }

  /**
   * Wait for SAP dropdown to fully load
   */
  protected async waitForSAPDropdownLoad(timeout: number = this.WAIT_TIMEOUT_LONG): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(500);
  }

  /**
   * Wait for SAP table to fully load
   */
  protected async waitForSAPTableLoad(timeout: number = this.WAIT_TIMEOUT_MEDIUM): Promise<void> {
    await this.page.waitForLoadState(this.WAIT_NETWORKIDLE);
    await this.page.waitForTimeout(300);
  }

  /**
   * Wait for an element to be visible with error handling
   */
  protected async waitForElement(
    locator: Locator,
    options: { state?: 'visible' | 'hidden' | 'attached' | 'detached'; timeout?: number } = {}
  ): Promise<void> {
    const state = options.state || 'visible';
    const timeout = options.timeout || this.WAIT_TIMEOUT_LONG;

    try {
      await locator.waitFor({ state: state as any, timeout });
    } catch (error) {
      this.logError(`Timeout waiting for element (${state})`, `${timeout}ms`);
      throw error;
    }
  }

  /**
   * Wait for multiple elements (for table rows, dropdowns, etc.)
   */
  protected async waitForElements(
    locator: Locator,
    minCount: number = 1,
    timeout: number = this.WAIT_TIMEOUT_LONG
  ): Promise<number> {
    try {
      let count = 0;
      const startTime = Date.now();

      while (count < minCount && Date.now() - startTime < timeout) {
        count = await locator.count();
        if (count < minCount) {
          await this.page.waitForTimeout(100);
        }
      }

      if (count < minCount) {
        throw new Error(`Expected at least ${minCount} elements, but found ${count}`);
      }

      return count;
    } catch (error) {
      this.logError(`Failed to find minimum elements`, `${minCount} required, timeout: ${timeout}ms`);
      throw error;
    }
  }

  // ============================================================================
  // CLICK INTERACTIONS WITH RETRY
  // ============================================================================

  /**
   * Click element with retry logic for SAP UI5 reliability
   * Retries if element becomes stale or click fails
   */
  protected async clickWithRetry(
    locator: Locator,
    options: { maxRetries?: number; timeout?: number } = {}
  ): Promise<void> {
    const maxRetries = options.maxRetries || 3;
    const timeout = options.timeout || this.WAIT_TIMEOUT_SHORT;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await locator.click({ timeout });
        await this.waitForSAPTableLoad(); // Brief wait after click
        return;
      } catch (error) {
        if (i === maxRetries - 1) {
          this.logError('Click failed after retries', `${maxRetries} attempts`);
          throw error;
        }
        this.logWarning(`Click retry ${i + 1}/${maxRetries}`, 'element not ready');
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * Click a value help button and wait for dropdown
   */
  protected async clickValueHelpButton(locator: Locator): Promise<void> {
    this.logAction('Opening dropdown via value help button');
    await this.clickWithRetry(locator);
    await this.waitForSAPDropdownLoad();
  }

  // ============================================================================
  // FILL/INPUT INTERACTIONS
  // ============================================================================

  /**
   * Fill input field with text
   */
  protected async fillInputField(
    locator: Locator,
    value: string,
    options: { clear?: boolean; timeout?: number } = {}
  ): Promise<void> {
    const clear = options.clear !== false; // Default to true
    const timeout = options.timeout || this.WAIT_TIMEOUT_MEDIUM;

    try {
      await this.waitForElement(locator, { timeout });

      if (clear) {
        await locator.clear();
      }

      await locator.fill(value);
      this.logAction('Input field filled', `"${value}"`);

      // Wait for any cascading changes
      await this.page.waitForTimeout(300);
    } catch (error) {
      this.logError('Failed to fill input field', value);
      throw error;
    }
  }

  /**
   * Fill multiple input fields from a map
   */
  protected async fillMultipleFields(fieldMap: Map<Locator, string>): Promise<void> {
    this.logAction('Filling multiple input fields', `${fieldMap.size} fields`);

    for (const [locator, value] of fieldMap.entries()) {
      await this.fillInputField(locator, value);
    }
  }

  // ============================================================================
  // TABLE/DROPDOWN SELECTION
  // ============================================================================

  /**
   * Select a row from dropdown/table by matching text
   *
   * @param tableBodyLocator - Locator for table body element
   * @param searchText - Text to match in row
   * @param options - Additional options (exact match, case sensitive, etc.)
   */
  protected async selectTableRowByText(
    tableBodyLocator: Locator,
    searchText: string,
    options: { exactMatch?: boolean; caseSensitive?: boolean } = {}
  ): Promise<void> {
    const exactMatch = options.exactMatch !== false;
    const caseSensitive = options.caseSensitive || false;

    try {
      await this.waitForElements(tableBodyLocator.locator('tr[role="row"]'), 1);

      let selector: string;
      if (exactMatch) {
        selector = `tr[role="row"]:has(span:text-is("${searchText}"))`;
      } else {
        selector = `tr[role="row"]:has(span:text("${searchText}"))`;
      }

      const matchingRow = tableBodyLocator.locator(selector);
      const count = await matchingRow.count();

      if (count === 0) {
        this.logError(`No row found matching text`, `"${searchText}"`);
        throw new Error(`Row with text "${searchText}" not found in table`);
      }

      if (count > 1) {
        this.logWarning(`Multiple rows match text, selecting first`, `"${searchText}" (${count} matches)`);
      }

      await matchingRow.first().click();
      this.logAction('Table row selected', `"${searchText}"`);
      await this.waitForSAPTableLoad();
    } catch (error) {
      this.logError('Failed to select table row by text', searchText);
      throw error;
    }
  }

  /**
   * Select a row by index
   */
  protected async selectTableRowByIndex(
    tableBodyLocator: Locator,
    index: number
  ): Promise<void> {
    try {
      const allRows = tableBodyLocator.locator('tr[role="row"]');
      const count = await this.waitForElements(allRows, index + 1);

      if (index >= count) {
        this.logError(`Index out of bounds`, `${index} >= ${count}`);
        throw new Error(`Index ${index} out of bounds. Table has ${count} rows.`);
      }

      await allRows.nth(index).click();
      this.logAction('Table row selected', `index: ${index}`);
      await this.waitForSAPTableLoad();
    } catch (error) {
      this.logError('Failed to select table row by index', String(index));
      throw error;
    }
  }

  /**
   * Select a random row from table
   * Returns the index of selected row
   */
  protected async selectRandomTableRow(tableBodyLocator: Locator): Promise<number> {
    try {
      const allRows = tableBodyLocator.locator('tr[role="row"]');
      const rowCount = await this.waitForElements(allRows, 1);

      const randomIndex = Math.floor(Math.random() * rowCount);
      await allRows.nth(randomIndex).click();

      this.logAction('Random table row selected', `index: ${randomIndex}/${rowCount}`);
      await this.waitForSAPTableLoad();

      return randomIndex;
    } catch (error) {
      this.logError('Failed to select random table row', '');
      throw error;
    }
  }

  /**
   * Get all text content from table rows
   * Useful for assertions or finding specific rows
   */
  protected async getTableRowTexts(tableBodyLocator: Locator): Promise<string[]> {
    try {
      const allRows = tableBodyLocator.locator('tr[role="row"]');
      const count = await allRows.count();

      const texts: string[] = [];
      for (let i = 0; i < count; i++) {
        const text = await allRows.nth(i).textContent() || '';
        texts.push(text.trim());
      }

      this.logAction('Table rows retrieved', `${count} rows`);
      return texts;
    } catch (error) {
      this.logError('Failed to get table row texts', '');
      throw error;
    }
  }

  /**
   * Get count of rows in table
   */
  protected async getTableRowCount(tableBodyLocator: Locator): Promise<number> {
    try {
      const count = await tableBodyLocator.locator('tr[role="row"]').count();
      return count;
    } catch (error) {
      this.logError('Failed to get table row count', '');
      throw error;
    }
  }

  // ============================================================================
  // VALUE RETRIEVAL
  // ============================================================================

  /**
   * Get text content from element
   */
  protected async getElementText(locator: Locator, timeout: number = this.WAIT_TIMEOUT_MEDIUM): Promise<string> {
    try {
      await this.waitForElement(locator, { timeout });
      const text = await locator.textContent() || '';
      return text.trim();
    } catch (error) {
      this.logError('Failed to get element text', '');
      throw error;
    }
  }

  /**
   * Get input field value
   */
  protected async getInputValue(locator: Locator, timeout: number = this.WAIT_TIMEOUT_MEDIUM): Promise<string> {
    try {
      await this.waitForElement(locator, { timeout });
      return await locator.inputValue();
    } catch (error) {
      this.logError('Failed to get input value', '');
      throw error;
    }
  }

  /**
   * Get multiple input field values
   */
  protected async getMultipleInputValues(locators: Map<string, Locator>): Promise<Map<string, string>> {
    const result = new Map<string, string>();

    for (const [key, locator] of locators.entries()) {
      const value = await this.getInputValue(locator);
      result.set(key, value);
    }

    return result;
  }

  // ============================================================================
  // VISIBILITY & STATE CHECKS
  // ============================================================================

  /**
   * Check if element is visible
   */
  protected async isElementVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      return await locator.isVisible({ timeout });
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists in DOM
   */
  protected async isElementPresent(locator: Locator): Promise<boolean> {
    try {
      return (await locator.count()) > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get count of elements safely
   */
  protected async getElementCount(locator: Locator): Promise<number> {
    try {
      return await locator.count();
    } catch {
      return 0;
    }
  }

  // ============================================================================
  // KEYBOARD INTERACTIONS
  // ============================================================================

  /**
   * Press a key (Escape, Enter, Tab, etc.)
   */
  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
    this.logAction(`Key pressed`, key);
    await this.page.waitForTimeout(100);
  }

  /**
   * Clear field using keyboard (Ctrl+A + Delete)
   */
  protected async clearFieldWithKeyboard(locator: Locator): Promise<void> {
    await locator.focus();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Delete');
    this.logAction('Field cleared with keyboard');
  }

  // ============================================================================
  // PAGE NAVIGATION
  // ============================================================================

  /**
   * Navigate to URL
   */
  protected async goto(url: string, options: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' } = {}): Promise<void> {
    const waitUntil = options.waitUntil || this.WAIT_NETWORKIDLE;
    await this.page.goto(url, { waitUntil: waitUntil as any });
    this.logAction('Navigated to', url);
  }

  /**
   * Go back in browser history
   */
  protected async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForSAPFormLoad();
    this.logAction('Navigated back');
  }

  /**
   * Refresh page
   */
  protected async refreshPage(): Promise<void> {
    await this.page.reload();
    await this.waitForSAPFormLoad();
    this.logAction('Page refreshed');
  }

  // ============================================================================
  // SCROLL UTILITIES
  // ============================================================================

  /**
   * Scroll element into view
   */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    this.logAction('Scrolled element into view');
  }

  /**
   * Scroll page by amount
   */
  protected async scrollPage(x: number = 0, y: number = 500): Promise<void> {
    await this.page.evaluate(([x, y]) => window.scrollBy(x, y), [x, y]);
    await this.page.waitForTimeout(300);
    this.logAction('Page scrolled', `x: ${x}, y: ${y}`);
  }

  // ============================================================================
  // DIALOG/MODAL HANDLING
  // ============================================================================

  /**
   * Wait for dialog to appear
   */
  protected async waitForDialog(dialogLocator: Locator, timeout: number = this.WAIT_TIMEOUT_LONG): Promise<void> {
    await this.waitForElement(dialogLocator, { timeout });
    this.logAction('Dialog appeared');
  }

  /**
   * Wait for dialog to close
   */
  protected async waitForDialogClose(dialogLocator: Locator, timeout: number = this.WAIT_TIMEOUT_LONG): Promise<void> {
    await dialogLocator.waitFor({ state: 'hidden', timeout });
    this.logAction('Dialog closed');
  }

  /**
   * Close dialog by pressing Escape
   */
  protected async closeDialogWithEscape(): Promise<void> {
    await this.pressKey('Escape');
    this.logAction('Dialog closed with Escape key');
  }
}
