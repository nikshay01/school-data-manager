import mongoose from "mongoose";

const uri = "mongodb+srv://realUser:vestige5586@task-manager.84cf9tg.mongodb.net/schoolDH?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("user", userSchema);

mongoose.connect(uri)
  .then(async () => {
    const users = await User.find();
    console.log(users);
    mongoose.disconnect();
  })
  .catch(console.error);
