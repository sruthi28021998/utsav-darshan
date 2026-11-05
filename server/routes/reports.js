import { Router } from "express";
import Report from "../models/Report.js";

const r = Router();
r.post("/", async (req, res) => {
  const { event, reason } = req.body;
  res.status(201).json(await Report.create({ event, reason }));
});
export default r;