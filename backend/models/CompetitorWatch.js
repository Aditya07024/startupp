import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    followers: Number,
    engagement: Number,
    postsPerWeek: Number,
    topHashtags: [String],
    capturedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const competitorWatchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    handle: { type: String, required: true },
    platform: { type: String, required: true, lowercase: true },
    niche: String,
    snapshots: [snapshotSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CompetitorWatch", competitorWatchSchema);
