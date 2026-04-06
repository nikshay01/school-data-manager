import mongoose from 'mongoose';
import dotenv from 'dotenv';
import School from './models/School.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_data_manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const schools = await School.find({ name: { $regex: 'disha', $options: 'i' } });
  console.log("Found Schools:", schools);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
