import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  sNo: Number,
  studentName: String,
  fatherName: String,
  class: String,
  section: String,
  srNo: String,
  address: String,
  contact: String,
  aadhar: String,
  adDate: String,
  dob: String,
  penID: String,
  adFee: Number,
  fee: Number,
  bus: Number,
  hostel: Number,
  discount: Number,
  total: Number,
  received: Number,
  due: Number,
  concessionBy: String,
  amount: Number,
  rn: String,
  date: String
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
