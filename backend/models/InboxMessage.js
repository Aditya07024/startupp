import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    body: String,
    sentAt: { type: Date, default: Date.now },
    aiSuggested: { type: Boolean, default: false },
  },
  { _id: false }
);

const inboxMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true, lowercase: true },
    type: { type: String, enum: ["dm", "comment", "mention"], required: true },
    senderName: String,
    senderAvatar: String,
    content: String,
    isRead: { type: Boolean, default: false },
    replies: [replySchema],
    repliedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("InboxMessage", inboxMessageSchema);
