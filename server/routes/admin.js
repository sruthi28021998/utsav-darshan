import { Router } from "express";
import Event from "../models/Event.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Activity from "../models/Activity.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { logActivity } from "../utils/log.js";

const r = Router();
r.use(protect, adminOnly);

r.get("/stats", async (_req, res) => {
  const [events, pending, users, reports, totals, perCity, top] = await Promise.all([
    Event.countDocuments({ status: "approved" }),
    Event.countDocuments({ status: "pending" }),
    User.countDocuments(),
    Report.countDocuments({ resolved: false }),
    Event.aggregate([{ $group: { _id: null, views: { $sum: "$views" }, saves: { $sum: "$saves" } } }]),
    Event.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Event.find({ status: "approved" }).sort({ views: -1 }).limit(5).select("name city views saves"),
  ]);
  res.json({
    events, pending, users, reports, perCity, top,
    views: totals[0]?.views || 0,
    saves: totals[0]?.saves || 0,
  });
});

r.get("/activity", async (_req, res) => {
  res.json(
    await Activity.find().sort({ createdAt: -1 }).limit(30)
      .populate("user", "name").populate("event", "name")
  );
});

r.get("/events", async (req, res) => {
  const f = req.query.status ? { status: req.query.status } : {};
  res.json(await Event.find(f).populate("contributor", "name email").sort({ createdAt: -1 }));
});

r.patch("/events/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected", "cancelled"].includes(status))
    return res.status(400).json({ message: "Invalid status" });
  const ev = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!ev) return res.status(404).json({ message: "Event not found" });
  logActivity("event_" + status, req.user.id, ev._id, ev.name);
  res.json(ev);
});

r.put("/events/:id", async (req, res) => {
  const { name, city, state, location, lat, lng, category, startDate, endDate, description, significance, poster } = req.body;
  const ev = await Event.findByIdAndUpdate(
    req.params.id,
    { name, city, state, location, lat, lng, category, startDate, endDate, description, significance, poster },
    { new: true, omitUndefined: true }
  );
  if (!ev) return res.status(404).json({ message: "Event not found" });
  logActivity("event_edited_by_admin", req.user.id, ev._id, ev.name);
  res.json(ev);
});

r.delete("/events/:id", async (req, res) => {
  const ev = await Event.findByIdAndDelete(req.params.id);
  if (ev) logActivity("event_deleted", req.user.id, null, ev.name);
  res.json({ message: "Deleted" });
});

r.get("/reports", async (_req, res) => {
  res.json(await Report.find({ resolved: false }).populate("event", "name city"));
});

r.patch("/reports/:id/resolve", async (req, res) => {
  res.json(await Report.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true }));
});

export default r;