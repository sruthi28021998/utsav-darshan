import { Router } from "express";
import Event from "../models/Event.js";
import { protect } from "../middleware/auth.js";

const r = Router();

// Public: approved events with filters (city, q, category, month range)
r.get("/", async (req, res) => {
  const { city, q, category, from, to } = req.query;
  const f = { status: "approved" };
  if (city) f.city = new RegExp(`^${city}$`, "i");
  if (category) f.category = category;
  if (q) f.$or = [{ name: new RegExp(q, "i") }, { city: new RegExp(q, "i") }];
  if (from && to) {
    f.startDate = { $lte: new Date(to) };
    f.endDate = { $gte: new Date(from) };
  }
  res.json(await Event.find(f).sort({ startDate: 1 }));
});

r.get("/cities", async (_req, res) => {
  res.json(await Event.distinct("city", { status: "approved" }));
});

r.get("/mine", protect, async (req, res) => {
  res.json(await Event.find({ contributor: req.user.id }).sort({ createdAt: -1 }));
});

r.get("/:id", async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
  if (!ev) return res.status(404).json({ message: "Not found" });
  res.json(ev);
});

r.post("/:id/save", async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, { $inc: { saves: 1 } }, { new: true });
  res.json({ saves: ev.saves });
});

r.post("/", protect, async (req, res) => {
  try {
    const ev = await Event.create({ ...req.body, contributor: req.user.id, status: "pending" });
    res.status(201).json(ev);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default r;