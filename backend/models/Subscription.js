import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["basic", "pro", "premium"], required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: String,
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    startDate: Date,
    endDate: Date,
    trialEndsAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
