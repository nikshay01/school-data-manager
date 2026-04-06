import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/school_data_manager').then(async () => {
  const Student = (await import('./models/Student.js')).default;
  const s = await Student.find({'payments.0': {$exists: true}}).limit(2);
  console.log(JSON.stringify(s.map(st => st.payments), null, 2));
  process.exit(0);
});
