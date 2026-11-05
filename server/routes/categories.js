import { Router } from "express";
import Category from "../models/Category.js";
import { protect, adminOnly } from "../middleware/auth.js";

const r = Router();
const defaults = ["Festival", "Mela", "Yatra", "Temple Event", "Cultural Program", "Fair"];

r.get("/", async (_req, res) => {
  if ((await Category.countDocuments()) === 0)
    await Category.insertMany(defaults.map((name) => ({ name })));
  res.json(await Category.find().sort({ name: 1 }));
});

r.post("/", protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Category.create({ name: req.body.name }));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

r.delete("/:id", protect, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default r;