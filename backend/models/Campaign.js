import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    platform: [{ type: String }],
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "open", "active", "paused", "completed"],
      default: "open",
    },
    reach: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    targetAudience: String,
    requirements: String,
    followerRequirement: { type: Number, default: 0 },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Campaign", campaignSchema);
