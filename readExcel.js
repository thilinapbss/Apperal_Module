const XLSX = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'testData', 'Buyer_PO_Upload', 'PO Summary format1.xlsx');
  console.log('Reading file:', filePath);

  const workbook = XLSX.readFile(filePath);
  console.log('Sheet names:', workbook.SheetNames);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(worksheet);
  console.log('Excel data:');
  console.log(JSON.stringify(data, null, 2));

  if (data.length > 0) {
    console.log('\nFirst row columns:');
    Object.keys(data[0]).forEach(key => {
      console.log(`  "${key}": "${data[0][key]}"`);
    });
  }
} catch (error) {
  console.error('Error:', error.message);
}
