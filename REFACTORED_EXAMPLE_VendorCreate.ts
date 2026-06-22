/**
 * EXAMPLE: Fully Refactored VendorCreate using BasePage Infrastructure
 *
 * This file shows what a fully refactored POM should look like.
 * Copy this pattern to other POMs!
 *
 * Location: src/pages/Vendor/VendorCreate.ts
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import type { FormFillResult, OperationResponse } from '../../types';

/**
 * VendorCreate - Page Object for Vendor Creation Form
 *
 * Handles all interactions for creating a new vendor in SAP.
 * Uses BasePage for common SAP UI5 patterns.
 *
 * @example
 * const vendor = new VendorCreate(page);
 * await vendor.waitForFormLoad();
 * await vendor.fillVendorName('VENDOR-001');
 * await vendor.fillStatus('Active');
 * await vendor.clickSaveButton();
 */
export class VendorCreate extends BasePage {
  readonly vendorNameInput: Locator;
  readonly statusInput: Locator;
  readonly statusValueHelpButton: Locator;
  readonly statusDropdownTable: Locator;
  readonly vendorCodeDisplay: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    // Input Fields
    this.vendorNameInput = this.sapLocator('name', 'DataField', '::Field-edit-inner');
    this.statusInput = this.sapLocator('status', 'DataField', '::Field-edit-inner-inner');
    this.statusValueHelpButton = page.locator('span[aria-label="Show Value Help"]').last();

    // Display Fields
    this.vendorCodeDisplay = page.locator('[id*="DataField::code::Field-display"], [id*="DataField::Code::Field-display"]');

    // Dropdowns & Tables
    this.statusDropdownTable = page.locator('tbody[id*="SuggestTable-tblBody"]');

    // Buttons
    this.saveButton = page.locator('button[id$="::FooterBar::StandardAction::Save"]');
    this.cancelButton = page.locator('button[id$="::FooterBar::StandardAction::Cancel"]');
  }

  // ==========================================================================
  // FORM INITIALIZATION
  // ==========================================================================

  /**
   * Wait for form to fully load
   * Checks visibility of vendor name input field
   *
   * @throws Error if form doesn't load within timeout
   */
  async waitForFormLoad(): Promise<void> {
    this.logAction('Waiting for vendor form to load');
    await this.waitForElement(this.vendorNameInput, {
      timeout: this.WAIT_TIMEOUT_VERY_LONG
    });
    this.logAction('Vendor form loaded successfully');
  }

  // ==========================================================================
  // FORM DATA ENTRY - INPUT FIELDS
  // ==========================================================================

  /**
   * Fill vendor name input field
   *
   * @param name - Vendor name to enter
   * @throws Error if field is not accessible
   */
  async fillVendorName(name: string): Promise<void> {
    this.logAction('Filling vendor name', name);
    await this.fillInputField(this.vendorNameInput, name);
  }

  /**
   * Fill status field and select from dropdown
   *
   * Handles both:
   * 1. Direct text input (if no dropdown)
   * 2. Dropdown selection (if value help exists)
   *
   * @param status - Status value to select (e.g., 'Active', 'Inactive')
   * @returns Result with success status and message
   */
  async fillStatus(status: string): Promise<FormFillResult> {
    this.logAction('Filling status field', status);

    try {
      // Step 1: Type status into input field
      await this.fillInputField(this.statusInput, status);

      // Step 2: Check if value help button exists (dropdown available)
      const hasValueHelp = await this.isElementVisible(this.statusValueHelpButton, 1000);

      if (hasValueHelp) {
        this.logAction('Opening status dropdown', 'value help available');

        // Step 3: Click value help button
        await this.clickValueHelpButton(this.statusValueHelpButton);

        // Step 4: Wait for dropdown table
        await this.waitForElements(
          this.statusDropdownTable.locator('tr[role="row"]'),
          1,
          this.WAIT_TIMEOUT_LONG
        );

        // Step 5: Select matching status from dropdown
        try {
          await this.selectTableRowByText(this.statusDropdownTable, status);
          this.logAction('Status selected from dropdown', status);
        } catch (error) {
          this.logWarning('Status not found in dropdown, using typed value', status);
          // Don't throw - we already typed the value above
        }
      } else {
        this.logWarning('No value help dropdown for status', 'using typed value only');
      }

      return {
        fieldName: 'status',
        value: status,
        success: true
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Failed to fill status field', errorMsg);

      return {
        fieldName: 'status',
        value: status,
        success: false,
        errorMessage: errorMsg
      };
    }
  }

  /**
   * Fill multiple fields at once
   *
   * @param name - Vendor name
   * @param status - Vendor status
   * @returns Array of results for each field
   */
  async fillFormData(name: string, status: string): Promise<FormFillResult[]> {
    this.logAction('Filling complete vendor form data');

    const results: FormFillResult[] = [];

    try {
      // Fill name
      await this.fillVendorName(name);
      results.push({
        fieldName: 'vendorName',
        value: name,
        success: true
      });

      // Fill status
      const statusResult = await this.fillStatus(status);
      results.push(statusResult);

      this.logAction('Form data entry completed', `${results.length} fields filled`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Error during form data entry', errorMsg);
      throw error;
    }

    return results;
  }

  // ==========================================================================
  // FORM DATA RETRIEVAL
  // ==========================================================================

  /**
   * Get vendor code from display field (read-only)
   *
   * @returns Vendor code value
   */
  async getVendorCode(): Promise<string> {
    this.logAction('Retrieving vendor code');
    return await this.getElementText(this.vendorCodeDisplay);
  }

  /**
   * Get vendor name from input field
   *
   * @returns Vendor name value
   */
  async getVendorName(): Promise<string> {
    this.logAction('Retrieving vendor name');
    return await this.getInputValue(this.vendorNameInput);
  }

  /**
   * Get status from input field
   *
   * @returns Status value
   */
  async getStatus(): Promise<string> {
    this.logAction('Retrieving status');
    return await this.getInputValue(this.statusInput);
  }

  /**
   * Get all filled form data at once
   *
   * @returns Map of field names to values
   */
  async getFormData(): Promise<Map<string, string>> {
    this.logAction('Retrieving all form data');

    const formData = new Map<string, string>();

    try {
      formData.set('vendorCode', await this.getVendorCode());
      formData.set('vendorName', await this.getVendorName());
      formData.set('status', await this.getStatus());

      this.logAction('Form data retrieved', `${formData.size} fields`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Failed to retrieve form data', errorMsg);
      throw error;
    }

    return formData;
  }

  // ==========================================================================
  // FORM SUBMISSION
  // ==========================================================================

  /**
   * Click save button to submit form
   *
   * @throws Error if save button is not accessible
   */
  async clickSaveButton(): Promise<void> {
    this.logAction('Clicking save button');
    await this.clickWithRetry(this.saveButton, { maxRetries: 3 });
    await this.waitForSAPFormLoad();
    this.logAction('Form submitted successfully');
  }

  /**
   * Click cancel button to discard changes
   *
   * @throws Error if cancel button is not accessible
   */
  async clickCancelButton(): Promise<void> {
    this.logAction('Clicking cancel button');
    await this.clickWithRetry(this.cancelButton);
    await this.waitForSAPTableLoad();
    this.logAction('Form cancelled');
  }

  // ==========================================================================
  // COMPLETE WORKFLOW METHODS
  // ==========================================================================

  /**
   * Complete vendor creation workflow
   *
   * Performs full create flow:
   * 1. Wait for form
   * 2. Fill form data
   * 3. Save form
   * 4. Verify code was generated
   *
   * @param name - Vendor name
   * @param status - Vendor status
   * @returns Operation result with created vendor code
   */
  async createVendor(name: string, status: string): Promise<OperationResponse<Map<string, string>>> {
    const startTime = new Date();
    this.logAction('Starting vendor creation workflow', `${name} / ${status}`);

    try {
      // Wait for form
      await this.waitForFormLoad();

      // Fill form
      const fillResults = await this.fillFormData(name, status);
      const allFilled = fillResults.every(r => r.success);

      if (!allFilled) {
        throw new Error('Not all form fields filled successfully');
      }

      // Save
      await this.clickSaveButton();

      // Get created code
      const formData = await this.getFormData();

      const duration = Date.now() - startTime.getTime();
      this.logAction('Vendor creation completed', `${duration}ms`);

      return {
        success: true,
        data: formData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Vendor creation failed', errorMsg);

      return {
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ==========================================================================
  // STATE VERIFICATION
  // ==========================================================================

  /**
   * Check if form is in edit mode (not read-only)
   *
   * @returns True if form fields are editable
   */
  async isFormEditable(): Promise<boolean> {
    const isNameEditable = await this.isElementVisible(this.vendorNameInput, 1000);
    return isNameEditable;
  }

  /**
   * Check if save button is enabled
   *
   * @returns True if save button can be clicked
   */
  async isSaveButtonEnabled(): Promise<boolean> {
    const locator = this.saveButton;
    const isVisible = await this.isElementVisible(locator, 1000);

    if (!isVisible) return false;

    // In SAP, disabled buttons often have class 'sapMBtnDisabled'
    const isDisabled = await locator.evaluate((el) => {
      return el.classList.contains('sapMBtnDisabled') || el.hasAttribute('disabled');
    });

    return !isDisabled;
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Clear entire form (reset to empty state)
   */
  async clearForm(): Promise<void> {
    this.logAction('Clearing form');

    try {
      await this.clearFieldWithKeyboard(this.vendorNameInput);
      await this.clearFieldWithKeyboard(this.statusInput);
      this.logAction('Form cleared successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Failed to clear form', errorMsg);
      throw error;
    }
  }

  /**
   * Capture and save form data to JSON file
   *
   * @param filePath - Full path where to save JSON file
   */
  async captureAndSaveFormData(filePath: string): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    this.logAction('Capturing and saving form data', filePath);

    try {
      const formData = await this.getFormData();

      // Convert map to object
      const dataObject: Record<string, string> = {};
      for (const [key, value] of formData) {
        dataObject[key] = value;
      }

      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save with proper formatting
      const jsonString = JSON.stringify(dataObject, null, 2);
      fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });

      this.logAction('Form data saved to file', filePath);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logError('Failed to save form data', errorMsg);
      throw error;
    }
  }
}

/**
 * USAGE EXAMPLES
 *
 * Example 1: Simple creation
 * ```typescript
 * const vendor = new VendorCreate(page);
 * await vendor.waitForFormLoad();
 * await vendor.fillVendorName('VENDOR-001');
 * await vendor.fillStatus('Active');
 * await vendor.clickSaveButton();
 * ```
 *
 * Example 2: Complete workflow
 * ```typescript
 * const vendor = new VendorCreate(page);
 * const result = await vendor.createVendor('VENDOR-001', 'Active');
 *
 * if (result.success) {
 *   console.log('Vendor created:', result.data);
 * } else {
 *   console.error('Creation failed:', result.error);
 * }
 * ```
 *
 * Example 3: Verify state
 * ```typescript
 * const vendor = new VendorCreate(page);
 * const isEditable = await vendor.isFormEditable();
 * const canSave = await vendor.isSaveButtonEnabled();
 * ```
 *
 * Example 4: Capture data
 * ```typescript
 * const vendor = new VendorCreate(page);
 * await vendor.fillFormData('VENDOR-001', 'Active');
 * await vendor.captureAndSaveFormData('testData/Vendor/created.json');
 * ```
 */
