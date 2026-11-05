import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: String,
    location: { type: String, required: true },
    lat: Number,
    lng: Number,
    category: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: String,
    significance: String,
    poster: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    contributor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    saves: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);
eventSchema.index({ name: "text", city: "text" });
export default mongoose.model("Event", eventSchema);