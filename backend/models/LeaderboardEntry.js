import mongoose from "mongoose";

const leaderboardEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    niche: String,
    platform: String,
    period: { type: String, enum: ["weekly", "monthly", "all-time"], default: "weekly" },
    score: Number,
    rank: Number,
    badge: String,
    engagementRate: Number,
    dealsCompleted: Number,
    followerGrowth: Number,
  },
  { timestamps: true }
);

export default mongoose.model("LeaderboardEntry", leaderboardEntrySchema);
