import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/categories.js";
import reportRoutes from "./routes/reports.js";
import { uploadDir } from "./middleware/upload.js";

dotenv.config();
const app = express();
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use(
  "/api/auth",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: "Too many attempts. Try again later." } })
);

app.use("/uploads", express.static(uploadDir));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
  res.status(500).json({ message: "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("Server on " + (process.env.PORT || 5000))))
  .catch((e) => console.error(e));