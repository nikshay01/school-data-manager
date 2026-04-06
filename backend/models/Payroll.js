import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    month: {
      type: String, // format YYYY-MM
      required: true,
    },
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["Bank Transfer", "Cash", "Cheque", "UPI"],
      default: "Bank Transfer",
    },
    referenceNumber: { type: String }, // Transaction ID or Cheque No
  },
  { timestamps: true }
);

// Prevent duplicate payrolls for the same student in the same month
payrollSchema.index({ staffId: 1, month: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;
