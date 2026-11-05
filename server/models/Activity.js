import mongoose from "mongoose";
export default mongoose.model(
  "Activity",
  new mongoose.Schema(
    {
      action: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
      meta: String,
    },
    { timestamps: true }
  )
);