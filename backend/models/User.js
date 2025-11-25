import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    schoolId:{type:String, required:true},
    position:{type:String,required:true},
    aadhar:{type:String},
    name:{type:String,required: true},
    address:{type:String, required:true},
    gender:{type:Boolean},//true:male,flase:female
    contact:{type:String},
    access:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
