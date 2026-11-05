import mongoose from "mongoose";
export default mongoose.model(
  "Report",
  new mongoose.Schema(
    {
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      reason: String,
      resolved: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);