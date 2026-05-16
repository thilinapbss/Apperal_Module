import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface BuyerPOData {
  buyer?: string;
  styleNo?: string;
  styleDescription?: string;
  styleColor?: string;
  season?: string;
  [key: string]: string | undefined;
}

export class ExcelReader {
  static readBuyerPOFile(filePath: string): BuyerPOData {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      if (data.length === 0) {
        throw new Error('Excel file is empty');
      }

      const buyerPOData: BuyerPOData = {};
      let buyerColumn = '';

      // Find the buyer data column (should be something like "QA 2")
      // The first 4 rows contain: Style No, Style Description, Style Color, Season
      const firstRow = data[0] as any;
      const columnKeys = Object.keys(firstRow);

      // Find the buyer column by looking for non-label, non-empty columns
      for (const key of columnKeys) {
        if (key !== 'Buyer ' && key !== ':' && !key.includes('__EMPTY')) {
          buyerColumn = key;
          buyerPOData.buyer = key.trim();
          break;
        }
      }

      // Extract data from vertical format (first 4 rows contain the header fields)
      if (buyerColumn && data.length >= 4) {
        // Row 0: Style No
        buyerPOData.styleNo = String(data[0][buyerColumn] || '').trim();

        // Row 1: Style Description
        buyerPOData.styleDescription = String(data[1][buyerColumn] || '').trim();

        // Row 2: Style Color
        buyerPOData.styleColor = String(data[2][buyerColumn] || '').trim();

        // Row 3: Season
        buyerPOData.season = String(data[3][buyerColumn] || '').trim();
      }

      return buyerPOData;
    } catch (error) {
      throw new Error(`Error reading Excel file: ${error}`);
    }
  }
}
