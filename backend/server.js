import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bioPageRoutes from "./routes/bioPageRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import competitorRoutes from "./routes/competitorRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import inboxRoutes from "./routes/inboxRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import repurposeRoutes from "./routes/repurposeRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import trendRoutes from "./routes/trendRoutes.js";
import viralScoreRoutes from "./routes/viralScoreRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ success: true, message: "ViralBoost API live" }));
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/repurpose", repurposeRoutes);
app.use("/api/viralscore", viralScoreRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/inbox", inboxRoutes);
app.use("/api/biopage", bioPageRoutes);
app.use("/api/competitor", competitorRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/schedule", scheduleRoutes);
app.get("/bio/:slug", (req, res) => res.redirect(`/api/biopage/public/${req.params.slug}`));
app.post("/bio/:slug/click/:linkId", (req, res) => res.redirect(307, `/api/biopage/public/${req.params.slug}/click/${req.params.linkId}`));
app.use(errorHandler);

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  });
