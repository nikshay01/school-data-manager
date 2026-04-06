import asyncHandler from "express-async-handler";
import Expense from "../models/Expense.js";

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
// @queries month (YYYY-MM), category
export const getExpenses = asyncHandler(async (req, res) => {
  const { month, category } = req.query;
  const query = { school: req.user.school };

  if (category && category !== "All") {
    query.category = category;
  }

  // Monthly filtering (Optional)
  if (month) {
    const [year, monthNum] = month.split("-");
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of the month

    query.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const expenses = await Expense.find(query).sort({ date: -1 });

  res.json(expenses);
});

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
export const addExpense = asyncHandler(async (req, res) => {
  const { title, description, amount, category, date, paymentMethod, referenceNumber } = req.body;

  if (!title || !amount || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const expense = await Expense.create({
    school: req.user.school,
    title,
    description,
    amount,
    category,
    date: date || new Date(),
    paymentMethod,
    referenceNumber,
  });

  res.status(201).json(expense);
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.school.toString() !== req.user.school.toString()) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedExpense);
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.school.toString() !== req.user.school.toString()) {
    res.status(404);
    throw new Error("Expense not found");
  }

  await Expense.deleteOne({ _id: req.params.id });

  res.json({ message: "Expense removed" });
});
