const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharva",
  "Dhruv",
  "Kabir",
  "Rudra",
  "Ananya",
  "Diya",
  "Gauri",
  "Isha",
  "Kavya",
  "Khushi",
  "Kiara",
  "Myra",
  "Nisha",
  "Pari",
  "Prisha",
  "Riya",
  "Saanvi",
  "Samaira",
  "Sara",
];
const lastNames = [
  "Sharma",
  "Verma",
  "Gupta",
  "Malhotra",
  "Bhatia",
  "Mehta",
  "Joshi",
  "Nair",
  "Patel",
  "Reddy",
  "Singh",
  "Yadav",
  "Das",
  "Chopra",
  "Khanna",
  "Jain",
  "Saxena",
  "Kaul",
  "Rao",
  "Kumar",
];
const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];
const sections = ["A", "B", "C", "D"];
const states = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "Punjab",
  "Haryana",
  "West Bengal",
];

const generateRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
};

const generateRandomMobile = () => {
  return Math.floor(6000000000 + Math.random() * 4000000000).toString();
};

const generateRandomAadhar = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const generateMockStudents = (count) => {
  const students = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const studentName = `${firstName} ${lastName}`;
    const fatherName = `${
      firstNames[Math.floor(Math.random() * firstNames.length)]
    } ${lastName}`;
    const className = classes[Math.floor(Math.random() * classes.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];

    // Simulate missing data for some students (approx 10%)
    const isMissingData = Math.random() < 0.1;

    const totalFee = Math.floor(Math.random() * 50000) + 20000;
    const receivedFee = Math.floor(Math.random() * totalFee);

    students.push({
      id: i, // Unique ID for React keys
      studentName: studentName,
      fatherName: fatherName,
      class: className,
      section: section,
      srNo: `SR-${2024000 + i}`,
      address: isMissingData
        ? ""
        : `${Math.floor(Math.random() * 100)}, Some Street, Some Area`,
      State: states[Math.floor(Math.random() * states.length)],
      contact: isMissingData ? "" : generateRandomMobile(),
      aadhar: isMissingData ? "" : generateRandomAadhar(),
      adDate: generateRandomDate(new Date(2020, 0, 1), new Date(2024, 0, 1)),
      dob: generateRandomDate(new Date(2005, 0, 1), new Date(2018, 0, 1)),
      penID: Math.random().toString(36).substring(2, 12).toUpperCase(),
      apaarID: Math.random().toString(36).substring(2, 14).toUpperCase(),
      leftSchool: Math.random() < 0.05, // 5% chance
      tcNumber:
        Math.random() < 0.05 ? `TC-${Math.floor(Math.random() * 1000)}` : "",
      udiseRemoved: false,
      leftDate: "",
      studentPhoto: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      fees: {
        adFee: 5000,
        fee: totalFee - 5000,
        bus: Math.random() < 0.3 ? 10000 : 0,
        hostel: Math.random() < 0.1 ? 50000 : 0,
        discount: Math.random() < 0.2 ? 2000 : 0,
        concessionBy: Math.random() < 0.2 ? "Principal" : "",
      },
      payments: [
        {
          amount: Math.floor(receivedFee / 2),
          rn: `REC-${Math.floor(Math.random() * 10000)}`,
          date: generateRandomDate(new Date(2024, 0, 1), new Date()),
        },
        {
          amount: Math.ceil(receivedFee / 2),
          rn: `REC-${Math.floor(Math.random() * 10000)}`,
          date: generateRandomDate(new Date(2024, 0, 1), new Date()),
        },
      ],
      // Helper for combined fees cell
      feeSummary: {
        total: totalFee,
        received: receivedFee,
        due: totalFee - receivedFee,
      },
    });
  }
  return students;
};

const mockStudents = generateMockStudents(150);

export default mockStudents;
