/**
 * SAP UI5 Element Types and Interfaces
 */

/**
 * Common SAP field information
 */
export interface SAPField {
  fieldName: string;
  fieldLabel: string;
  fieldType: 'input' | 'dropdown' | 'checkbox' | 'textarea' | 'datepicker';
  isRequired: boolean;
  isReadOnly: boolean;
}

/**
 * SAP Dropdown information
 */
export interface SAPDropdown extends SAPField {
  itemCount: number;
  items: string[];
  selectedValue: string;
}

/**
 * SAP Table information
 */
export interface SAPTable {
  tableId: string;
  tableName: string;
  rowCount: number;
  columnCount: number;
  columnHeaders: string[];
  data: Array<Record<string, string>>;
}

/**
 * SAP Table Row
 */
export interface SAPTableRow {
  rowIndex: number;
  rowId: string;
  cells: SAPTableCell[];
}

/**
 * SAP Table Cell
 */
export interface SAPTableCell {
  columnIndex: number;
  columnName: string;
  value: string;
  isEditable: boolean;
}

/**
 * SAP Dialog information
 */
export interface SAPDialog {
  dialogId: string;
  title: string;
  isVisible: boolean;
  buttons: string[];
}

/**
 * SAP Form section
 */
export interface SAPFormSection {
  sectionId: string;
  sectionTitle: string;
  fields: SAPField[];
  isExpanded: boolean;
}

/**
 * SAP Form information
 */
export interface SAPForm {
  formId: string;
  formTitle: string;
  sections: SAPFormSection[];
  isReadOnly: boolean;
}

/**
 * Value help result
 */
export interface ValueHelpResult {
  displayValue: string;
  actualValue: string;
  description?: string;
}
