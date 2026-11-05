import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerRules, loginRules, check } from "../middleware/validate.js";
import { logActivity } from "../utils/log.js";

const r = Router();
const sign = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

r.post("/register", registerRules, check, async (req, res) => {
  const { name, email, password, contact } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: "Email already used" });
  const user = await User.create({ name, email, contact, password: await bcrypt.hash(password, 10) });
  logActivity("register", user._id, null, name);
  res.json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
});

r.post("/login", loginRules, check, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email, role: user.role } });
});

export default r;