import mongoose from "mongoose";

const bioLinkSchema = new mongoose.Schema(
  {
    label: String,
    url: String,
    icon: String,
    clicks: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const bioPageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: String,
    bio: String,
    avatar: String,
    links: [bioLinkSchema],
    theme: {
      bgColor: { type: String, default: "#0A0A0F" },
      accentColor: { type: String, default: "#2563EB" },
      font: { type: String, default: "Outfit" },
    },
    totalClicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("BioPage", bioPageSchema);
