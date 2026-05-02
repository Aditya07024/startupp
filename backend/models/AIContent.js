import mongoose from "mongoose";

const aiContentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    hook: { type: String, required: true },
    script: { type: String, required: true },
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model("AIContent", aiContentSchema);
