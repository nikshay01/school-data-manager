import xlsx from 'xlsx';

const filePath = 'd:\\Nikshay\\coding\\big project\\school-data-manager\\real-frontend\\src\\data\\FEE 2025-26.xlsx';
const workbook = xlsx.readFile(filePath);

console.log('Sheet Names:', workbook.SheetNames);
for (const name of workbook.SheetNames) {
  const ws = workbook.Sheets[name];
  const d = xlsx.utils.sheet_to_json(ws, { header: 1 });
  console.log(`\nSheet: ${name}, Rows: ${d.length}`);
  if (d.length > 2) {
     console.log('Row 0:', d[0]);
     console.log('Row 1:', d[1]);
     console.log('Row 2:', d[2]);
  }
}

