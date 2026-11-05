import { Router } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import { protect, adminOnly } from "../middleware/auth.js";

const r = Router();
r.use(protect, adminOnly);

r.get("/stats", async (_req, res) => {
  const [events, pending, users, reports] = await Promise.all([
    Event.countDocuments({ status: "approved" }),
    Event.countDocuments({ status: "pending" }),
    User.countDocuments(),
    Report.countDocuments({ resolved: false }),
  ]);
  const perCity = await Event.aggregate([
    { $match: { status: "approved" } },
    { $group: { _id: "$city", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ events, pending, users, reports, perCity });
});

r.get("/events", async (req, res) => {
  const f = req.query.status ? { status: req.query.status } : {};
  res.json(await Event.find(f).populate("contributor", "name email").sort({ createdAt: -1 }));
});

r.patch("/events/:id/status", async (req, res) => {
  res.json(await Event.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
});

r.put("/events/:id", async (req, res) => {
  res.json(await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

r.delete("/events/:id", async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

r.get("/reports", async (_req, res) => {
  res.json(await Report.find({ resolved: false }).populate("event", "name city"));
});

r.patch("/reports/:id/resolve", async (req, res) => {
  res.json(await Report.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true }));
});

export default r;