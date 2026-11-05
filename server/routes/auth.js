import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const r = Router();
const sign = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

r.post("/register", async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already used" });
    const user = await User.create({ name, email, contact, password: await bcrypt.hash(password, 10) });
    res.json({ token: sign(user), user: { id: user._id, name, email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });
  res.json({ token: sign(user), user: { id: user._id, name: user.name, email, role: user.role } });
});

export default r;