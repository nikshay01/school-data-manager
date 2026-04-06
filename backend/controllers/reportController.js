import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Expense from "../models/Expense.js";
import Payroll from "../models/Payroll.js";

// @desc    Get dashboard summary stats
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const students = await Student.find({ school: req.user.school, leftSchool: false });

  let totalCollected = 0;
  let totalDue = 0;
  let zeroPaidCount = 0;
  const allPayments = [];

  students.forEach((s) => {
    // Calculate received
    const received = s.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    
    // Calculate total structure
    const totalStructure =
      (s.fees?.adFee || 0) +
      (s.fees?.fee || 0) +
      (s.fees?.bus || 0) +
      (s.fees?.hostel || 0) -
      (s.fees?.discount || 0);
      
    const due = Math.max(0, totalStructure - received);

    totalCollected += received;
    totalDue += due;
    if (received === 0) zeroPaidCount++;

    // Collect transactions
    if (s.payments && s.payments.length > 0) {
      s.payments.forEach((p) => {
        allPayments.push({
          amount: p.amount,
          date: p.date,
          rn: p.rn,
          studentName: s.studentName,
          studentId: s._id,
        });
      });
    }
  });

  const recentTransactions = allPayments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  res.json({
    totalStudents: students.length,
    totalCollected,
    totalDue,
    zeroPaidCount,
    recentTransactions,
  });
});

// @desc    Get detailed full reports (Attendance, Performance mock)
// @route   GET /api/reports/full
// @access  Private
export const getDetailedReports = asyncHandler(async (req, res) => {
  const schoolId = req.user.school;

  // 1. Gather Students
  const students = await Student.find({ school: schoolId, leftSchool: false });

  const classCounts = {};
  const feeByClass = {};
  let totalCollected = 0;

  students.forEach((s) => {
    const cls = s.class || "Unknown";
    classCounts[cls] = (classCounts[cls] || 0) + 1;

    const received = s.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalStructure =
      (s.fees?.adFee || 0) +
      (s.fees?.fee || 0) +
      (s.fees?.bus || 0) +
      (s.fees?.hostel || 0) -
      (s.fees?.discount || 0);
    const due = Math.max(0, totalStructure - received);

    totalCollected += received;

    if (!feeByClass[cls]) {
      feeByClass[cls] = { className: cls, collected: 0, due: 0 };
    }
    feeByClass[cls].collected += received;
    feeByClass[cls].due += due;
  });

  const feeByClassArray = Object.values(feeByClass);

  // 3. Real Attendance Calculation
  const attendanceDocs = await Attendance.find({ school: schoolId });
  let totalRecords = 0;
  let presentRecords = 0;
  const attByClass = {};

  attendanceDocs.forEach(doc => {
      totalRecords++;
      if (doc.status === "Present") presentRecords++;

      const cls = doc.className || "Unknown";
      if (!attByClass[cls]) attByClass[cls] = { className: cls, total: 0, present: 0 };
      attByClass[cls].total += 1;
      if (doc.status === "Present") attByClass[cls].present += 1;
  });

  const attendanceOverview = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;
  const attendanceByClassArray = Object.values(attByClass).map(a => ({
      className: a.className,
      attendanceRate: a.total > 0 ? Math.round((a.present / a.total) * 100) : 0
  }));

  // 4. Financial Calculation
  const totalExpensesDoc = await Expense.aggregate([
    { $match: { school: schoolId } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const totalPayrollDoc = await Payroll.aggregate([
    { $match: { school: schoolId } },
    { $group: { _id: null, total: { $sum: "$netPaid" } } }
  ]);

  const customExpenses = totalExpensesDoc[0]?.total || 0;
  const payrollExpenses = totalPayrollDoc[0]?.total || 0;
  const totalExpenses = customExpenses + payrollExpenses;

  // Returning the report struct
  res.json({
    attendanceOverivew: attendanceOverview, // kept typo for backwards compatibility
    attendanceByClass: attendanceByClassArray,
    feeByClass: feeByClassArray,
    academicPerformance: [
      { className: "Overall (Pending Exam Module)", avg: 0 }
    ],
    financialSummary: {
      income: totalCollected,
      expenses: totalExpenses,
      netProfit: totalCollected - totalExpenses,
    },
    studentsByClass: classCounts
  });
});
