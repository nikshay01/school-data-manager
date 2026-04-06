import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import Student from './models/Student.js';

dotenv.config();

function excelDateToJSDate(serial) {
  if (!serial) return null;
  if (typeof serial === "string") {
    const parts = serial.split("/");
    if (parts.length === 3) {
      const d = new Date(`20${parts[2].slice(-2)}-${parts[1]}-${parts[0]}`);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }
  const utc_days  = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;                                        
  const date_info = new Date(utc_value * 1000);
  return isNaN(date_info.getTime()) ? null : date_info;
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_data_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const schoolId = '6927d62cc612801b57970d5e'; // Disha Academy
  const filePath = 'd:\\Nikshay\\coding\\big project\\school-data-manager\\real-frontend\\src\\data\\FEE 2025-26.xlsx';
  const workbook = xlsx.readFile(filePath);

  const sheetsToImport = ['NURSERY', 'UKG', 'LKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

  let importedCount = 0;

  for (const sheetName of sheetsToImport) {
    if (!workbook.SheetNames.includes(sheetName)) continue;
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (!row || !row[1]) continue; // skip if no student name

      const studentName = String(row[1]).trim();
      const fatherName = row[2] ? String(row[2]).trim() : '';
      const sectionStr = row[3] ? String(row[3]).trim() : '';
      let srNo = row[4] ? String(row[4]).trim() : '';
      const address = row[5] ? String(row[5]).trim() : '';
      const contact = row[6] ? String(row[6]).trim() : '';

      if (!srNo) {
         srNo = `TEMP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      }

      const adFee = parseFloat(row[7]) || 0;
      const fee = parseFloat(row[8]) || 0;
      const bus = parseFloat(row[9]) || 0;
      const hostel = parseFloat(row[10]) || 0;
      const discount = parseFloat(row[11]) || 0;
      const concessionBy = row[15] ? String(row[15]).trim() : '';

      const payments = [];
      const paymentCols = [
        { am: 16, rn: 17, dt: 18 },
        { am: 19, rn: 20, dt: 21 },
        { am: 22, rn: 23, dt: 24 },
        { am: 25, rn: 26, dt: 27 }
      ];

      for (const col of paymentCols) {
        if (row[col.am]) {
          const dt = excelDateToJSDate(row[col.dt]);
          const paymentData = {
            amount: parseFloat(row[col.am]) || 0,
            rn: row[col.rn] ? String(row[col.rn]) : '',
          };
          if (dt) paymentData.date = dt;
          payments.push(paymentData);
        }
      }

      const studentData = {
        school: schoolId,
        studentName,
        fatherName,
        class: sheetName,
        section: sectionStr,
        srNo,
        address,
        contact,
        fees: {
          adFee,
          fee,
          bus,
          hostel,
          discount,
          concessionBy
        },
        payments
      };

      try {
        await Student.updateOne(
          { school: schoolId, srNo: srNo },
          { $set: studentData },
          { upsert: true }
        );
        importedCount++;
      } catch (err) {
        // If unique constraint error on something else, log it
        console.error(`Error importing ${studentName} (SR: ${srNo}):`, err.message);
      }
    }
  }

  console.log(`Successfully imported/updated ${importedCount} students.`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
