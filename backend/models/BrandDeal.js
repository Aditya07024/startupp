import mongoose from "mongoose";

const brandDealSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "active", "completed", "rejected"], default: "pending" },
    payoutAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("BrandDeal", brandDealSchema);
