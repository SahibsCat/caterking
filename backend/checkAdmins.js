import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const UserSchema = new mongoose.Schema({
  email: String,
  role: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admins = await User.find({ role: 'admin' });
  console.log('Admins found:', admins);
  process.exit(0);
}
run();
