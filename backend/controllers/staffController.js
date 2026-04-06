import asyncHandler from "express-async-handler";
import Staff from "../models/Staff.js";
import Payroll from "../models/Payroll.js";

// @desc    Get all active staff
// @route   GET /api/staff
// @access  Private
export const getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find({ school: req.user.school, status: "Active" }).sort({ createdAt: -1 });
  res.json(staff);
});

// @desc    Add new staff member
// @route   POST /api/staff
// @access  Private (Admin only ideally, but using user.school constraint)
export const addStaff = asyncHandler(async (req, res) => {
  const { name, employeeId, email, phone, department, designation, joiningDate, salaryStructure } = req.body;

  const existingStaff = await Staff.findOne({ employeeId, school: req.user.school });
  if (existingStaff) {
    res.status(400);
    throw new Error("Staff with this Employee ID already exists");
  }

  const staff = await Staff.create({
    school: req.user.school,
    name,
    employeeId,
    email,
    phone,
    department,
    designation,
    joiningDate,
    salaryStructure,
  });

  res.status(201).json(staff);
});

// @desc    Update staff details
// @route   PUT /api/staff/:id
// @access  Private
export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff || staff.school.toString() !== req.user.school.toString()) {
    res.status(404);
    throw new Error("Staff not found");
  }

  const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedStaff);
});

// @desc    Generate Payroll for a month
// @route   POST /api/staff/payroll
// @access  Private
export const generatePayroll = asyncHandler(async (req, res) => {
  const { staffId, month, baseSalary, allowances, deductions, paymentMethod, referenceNumber } = req.body;

  const staff = await Staff.findById(staffId);
  if (!staff || staff.school.toString() !== req.user.school.toString()) {
    res.status(404);
    throw new Error("Staff not found");
  }

  // Check if already paid for this month
  const existingPayroll = await Payroll.findOne({ staffId, month });
  if (existingPayroll) {
    res.status(400);
    throw new Error(`Salary already generated for ${staff.name} for month ${month}`);
  }

  const netPaid = Number(baseSalary) + Number(allowances) - Number(deductions);

  const payroll = await Payroll.create({
    staffId,
    school: req.user.school,
    month,
    baseSalary,
    allowances,
    deductions,
    netPaid,
    paymentMethod,
    referenceNumber,
  });

  res.status(201).json(payroll);
});

// @desc    Get Payroll History (Optional: filter by month)
// @route   GET /api/staff/payroll
// @access  Private
export const getPayrollHistory = asyncHandler(async (req, res) => {
  const { month } = req.query; // ?month=YYYY-MM
  const query = { school: req.user.school };
  if (month) {
    query.month = month;
  }

  const history = await Payroll.find(query).populate("staffId", "name employeeId designation department").sort({ paymentDate: -1 });
  res.json(history);
});
