import mongoose from "mongoose";

const scheduledPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    platform: { type: String, required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "published", "cancelled"], default: "scheduled" },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduledPost", scheduledPostSchema);
