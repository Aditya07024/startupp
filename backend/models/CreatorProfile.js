import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: String,
    platform: String,
    link: String,
    thumbnail: String,
    metrics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    niche: { type: String, default: "creator" },
    followerRanges: {
      instagram: String,
      facebook: String,
      youtube: String,
    },
    portfolio: [portfolioSchema],
    stats: {
      avgEngagement: { type: Number, default: 0 },
      totalReach: { type: Number, default: 0 },
      dealsCompleted: { type: Number, default: 0 },
    },
    mediaKit: {
      generated: { type: Boolean, default: false },
      downloadUrl: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CreatorProfile", creatorProfileSchema);
