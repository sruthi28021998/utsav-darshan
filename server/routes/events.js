import { Router } from "express";
import Event from "../models/Event.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { eventRules, check } from "../middleware/validate.js";
import { logActivity } from "../utils/log.js";

const r = Router();
const PUBLIC = ["approved", "cancelled"];
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pick = (b) => ({
  name: b.name, city: b.city, state: b.state, location: b.location,
  lat: b.lat || undefined, lng: b.lng || undefined, category: b.category,
  startDate: b.startDate, endDate: b.endDate, description: b.description,
  significance: b.significance, poster: b.poster,
});

r.get("/", async (req, res) => {
  const { city, q, category, from, to, page, limit } = req.query;
  const f = { status: { $in: PUBLIC } };
  if (city) f.city = new RegExp(`^${esc(city)}$`, "i");
  if (category) f.category = category;
  if (q) f.$or = [{ name: new RegExp(esc(q), "i") }, { city: new RegExp(esc(q), "i") }];
  if (from && to) {
    f.startDate = { $lte: new Date(to) };
    f.endDate = { $gte: new Date(from) };
  }
  if (page) {
    if (!from) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      f.endDate = { $gte: today };
    }
    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(50, parseInt(limit) || 9);
    const [events, total] = await Promise.all([
      Event.find(f).sort({ startDate: 1 }).skip((p - 1) * l).limit(l),
      Event.countDocuments(f),
    ]);
    return res.json({ events, total, pages: Math.ceil(total / l) });
  }
  res.json(await Event.find(f).sort({ startDate: 1 }).limit(500));
});

r.get("/cities", async (_req, res) => {
  res.json(await Event.distinct("city", { status: { $in: PUBLIC } }));
});

r.get("/mine", protect, async (req, res) => {
  res.json(await Event.find({ contributor: req.user.id }).sort({ createdAt: -1 }));
});

r.post("/upload", protect, (req, res) => {
  upload.single("poster")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: "No file selected" });
    res.json({ url: "/uploads/" + req.file.filename });
  });
});

r.get("/:id", async (req, res) => {
  const ev = await Event.findOneAndUpdate(
    { _id: req.params.id, status: { $in: PUBLIC } },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json(ev);
});

r.post("/:id/save", async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, { $inc: { saves: 1 } }, { new: true });
  if (!ev) return res.status(404).json({ message: "Event not found" });
  res.json({ saves: ev.saves });
});

r.post("/", protect, eventRules, check, async (req, res) => {
  const ev = await Event.create({ ...pick(req.body), contributor: req.user.id, status: "pending" });
  logActivity("event_submitted", req.user.id, ev._id, ev.name);
  res.status(201).json(ev);
});

r.put("/:id", protect, eventRules, check, async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev || String(ev.contributor) !== req.user.id)
    return res.status(404).json({ message: "Event not found" });
  if (ev.status === "cancelled") return res.status(400).json({ message: "Cancelled events can't be edited" });
  Object.assign(ev, pick(req.body), { status: "pending" });
  await ev.save();
  logActivity("event_edited", req.user.id, ev._id, ev.name);
  res.json(ev);
});

r.patch("/:id/cancel", protect, async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev || String(ev.contributor) !== req.user.id)
    return res.status(404).json({ message: "Event not found" });
  ev.status = "cancelled";
  await ev.save();
  logActivity("event_cancelled", req.user.id, ev._id, ev.name);
  res.json(ev);
});

export default r;