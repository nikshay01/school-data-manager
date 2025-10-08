import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  rn: { type: String },       // receipt number
  date: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String, default: "" },
  class: { type: String, default: "" },
  section: { type: String, default: "" },
  srNo: { type: String, default: "" },
  address: { type: String, default: "" },
  contact: { type: Number, default: 0 },
  aadhar: { type: Number, default: 0 },
  adDate: { type: Date, default: null },
  dob: { type: Date, default: null },
  penID: { type: Number, default: 0 },
  apaarID: { type: String, default: "" },        // new field
  leftSchool: { type: Boolean, default: false }, // new field
  tcNumber: { type: String, default: "" },       // new field, optional
  udiseRemoved: { type: Boolean, default: false }, // new field
  fees: {
    adFee: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    bus: { type: Number, default: 0 },
    hostel: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    concessionBy: { type: String, default: "" }
  },
  payments: { type: [paymentSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
