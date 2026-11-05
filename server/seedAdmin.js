import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
if (!(await User.findOne({ email: process.env.ADMIN_EMAIL }))) {
  await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    role: "admin",
  });
  console.log("Admin created");
} else console.log("Admin exists");
process.exit();