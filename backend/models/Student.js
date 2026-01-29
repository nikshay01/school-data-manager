import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  rn: { type: String }, // receipt number
  date: { type: Date, default: Date.now },
});

const studentSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    studentName: { type: String, required: true, index: true },
    fatherName: { type: String, default: "" },
    // motherName: { type: String, default: "" },
    class: { type: String, default: "", index: true },
    section: { type: String, default: "" },
    srNo: { type: String, default: "", index: true },
    address: { type: String, default: "" },
    State: { type: String, default: "" },
    contact: { type: String, default: "" }, // Changed to String
    aadhar: { type: String, default: "" }, // Changed to String
    adDate: { type: Date, default: null },
    dob: { type: Date, default: null },
    penID: { type: String, default: "" }, // Changed to String
    apaarID: { type: String, default: "" },
    leftSchool: { type: Boolean, default: false },
    tcNumber: { type: String, default: "" },
    udiseRemoved: { type: Boolean, default: false },
    leftDate: { type: Date, default: null },
    studentPhoto: { type: Boolean, default: null },
    fees: {
      adFee: { type: Number, default: 0 },
      fee: { type: Number, default: 0 },
      bus: { type: Number, default: 0 },
      hostel: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      concessionBy: { type: String, default: "" },
    },
    payments: { type: [paymentSchema], default: [] },
  },
  { timestamps: true }
);

// Compound index for unique SR No within a school
studentSchema.index(
  { school: 1, srNo: 1 },
  { unique: true, partialFilterExpression: { srNo: { $type: "string" } } }
);

export default mongoose.model("Student", studentSchema);
