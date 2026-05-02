import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema(
  {
    platform: String,
    handle: String,
    accessToken: String,
    refreshToken: String,
    platformUserId: String,
    isConnected: { type: Boolean, default: false },
    connectedAt: Date,
    metrics: {
      followers: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      change: { type: Number, default: 0 },
      history: {
        type: [
          new mongoose.Schema(
            {
              label: String,
              followers: Number,
              engagement: Number,
              reach: Number,
              views: Number,
            },
            { _id: false }
          ),
        ],
        default: [],
      },
      lastSyncedAt: Date,
    },
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["creator", "brand", "admin"], required: true },
    avatar: String,
    bio: String,
    isVerified: { type: Boolean, default: false },
    plan: { type: String, enum: ["basic", "pro", "premium"], default: "basic" },
    trialEndsAt: Date,
    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "expired", "cancelled"],
      default: "trial",
    },
    wallet: { type: walletSchema, default: () => ({}) },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    socialAccounts: { type: [socialAccountSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export default mongoose.model("User", userSchema);
