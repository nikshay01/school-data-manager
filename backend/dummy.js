// dummyData.js

import fetch from 'node-fetch'; // Required if running this file with Node.js
const API_URL = 'http://localhost:5000/api/students'; // adjust if hosted elsewhere

const generateRandomStudent = (i) => {
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomBool = () => Math.random() < 0.5;
  const classes = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['A', 'B', 'C'];
  const names = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Kabir', 'Tanya', 'Zoya', 'Aman', 'Neha', 'Ravi'];
  const lastNames = ['Sharma', 'Verma', 'Kumar', 'Gupta', 'Yadav'];

  const name = `${names[randomInt(0, names.length - 1)]} ${lastNames[randomInt(0, lastNames.length - 1)]}`;
  const fatherName = `${names[randomInt(0, names.length - 1)]} ${lastNames[randomInt(0, lastNames.length - 1)]}`;

  return {
    studentName: name,
    fatherName: fatherName,
    class: classes[randomInt(0, classes.length - 1)],
    section: sections[randomInt(0, sections.length - 1)],
    srNo: `SR${1000 + i}`,
    address: `Village ${randomInt(1, 50)}, Block ${randomInt(1, 10)}`,
    contact: 9000000000 + randomInt(0, 999999999),
    aadhar: 100000000000 + randomInt(0, 999999999999),
    adDate: new Date(2021, randomInt(0, 11), randomInt(1, 28)),
    dob: new Date(2009 + randomInt(0, 5), randomInt(0, 11), randomInt(1, 28)),
    penID: randomInt(100000, 999999),
    apaarID: `APAAR${randomInt(1000, 9999)}`,
    leftSchool: randomBool(),
    tcNumber: randomBool() ? `TC${randomInt(1000, 9999)}` : "",
    udiseRemoved: randomBool(),
    fees: {
      adFee: randomInt(100, 500),
      fee: randomInt(1000, 5000),
      bus: randomInt(0, 2000),
      hostel: randomInt(0, 3000),
      discount: randomInt(0, 500),
      concessionBy: randomBool() ? 'Principal' : ''
    },
    payments: [
      {
        amount: randomInt(100, 1000),
        rn: `RN${randomInt(1000, 9999)}`,
        date: new Date(2023, randomInt(0, 11), randomInt(1, 28))
      },
      {
        amount: randomInt(100, 1000),
        rn: `RN${randomInt(1000, 9999)}`,
        date: new Date(2024, randomInt(0, 11), randomInt(1, 28))
      }
    ]
  };
};

// Function to send data
const seedStudents = async () => {
  for (let i = 0; i < 20; i++) {
    const student = generateRandomStudent(i);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });

      const data = await res.json();
      console.log(`✅ Student ${i + 1} added:`, data.studentName);
    } catch (err) {
      console.error(`❌ Error adding student ${i + 1}:`, err.message);
    }
  }
};

seedStudents();
