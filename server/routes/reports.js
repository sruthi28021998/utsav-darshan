import { Router } from "express";
import Report from "../models/Report.js";
import Event from "../models/Event.js";
import { logActivity } from "../utils/log.js";

const r = Router();
r.post("/", async (req, res) => {
  const { event, reason } = req.body;
  if (!reason?.trim()) return res.status(400).json({ message: "Reason is required" });
  const ev = await Event.findById(event);
  if (!ev) return res.status(404).json({ message: "Event not found" });
  const rep = await Report.create({ event, reason: reason.trim().slice(0, 500) });
  logActivity("report_submitted", null, ev._id, ev.name);
  res.status(201).json(rep);
});
export default r;