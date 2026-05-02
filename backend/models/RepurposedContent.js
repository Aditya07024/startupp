import mongoose from "mongoose";

const outputSchema = new mongoose.Schema(
  {
    platform: String,
    title: String,
    content: String,
    hashtags: [String],
    tags: [String],
  },
  { _id: false }
);

const repurposedContentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sourceType: { type: String, enum: ["blog", "youtube", "tweet"], required: true },
    original: { type: String, required: true },
    targetPlatforms: [{ type: String }],
    outputs: [outputSchema],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("RepurposedContent", repurposedContentSchema);
