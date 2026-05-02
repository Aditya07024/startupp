import mongoose from "mongoose";

const trendAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    keyword: { type: String, required: true, trim: true },
    platform: { type: String, required: true, lowercase: true },
    mentionCount: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    spike: { type: Boolean, default: false },
    isTracked: { type: Boolean, default: false },
    detectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TrendAlert", trendAlertSchema);
