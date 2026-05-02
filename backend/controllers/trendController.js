import TrendAlert from "../models/TrendAlert.js";
import User from "../models/User.js";
import { getPlanLimits } from "../utils/plan.js";

const seeds = [
  ["ugc hooks", "instagram", 1820, 0.82, true],
  ["home workout transformation", "youtube", 1430, 0.74, true],
  ["creator ai tools", "facebook", 1100, 0.61, false],
  ["micro influencer roi", "instagram", 960, 0.69, false],
  ["brand collab tips", "youtube", 890, 0.57, true],
  ["reel retention", "instagram", 850, 0.66, false],
  ["youtube shorts growth", "youtube", 810, 0.71, true],
  ["dm closing script", "facebook", 700, 0.55, false],
  ["viral caption formula", "instagram", 660, 0.8, false],
  ["ugc portfolio", "instagram", 590, 0.73, false],
];

const ensureSeedData = async () => {
  const count = await TrendAlert.countDocuments({ userId: null });
  if (count) return;
  await TrendAlert.insertMany(
    seeds.map(([keyword, platform, mentionCount, sentimentScore, spike]) => ({
      keyword,
      platform,
      mentionCount,
      sentimentScore,
      spike,
      detectedAt: new Date(),
    }))
  );
};

export const getLiveTrends = async (req, res) => {
  try {
    await ensureSeedData();
    const trends = await TrendAlert.find({ userId: null }).sort({ mentionCount: -1 }).limit(10);
    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrendMentions = async (req, res) => {
  try {
    const keyword = req.query.keyword || "ugc hooks";
    const timeline = Array.from({ length: 7 }, (_, index) => ({
      label: `D${index + 1}`,
      mentions: 250 + index * 80 + keyword.length * 3,
    }));
    res.json({ success: true, keyword, timeline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackKeyword = async (req, res) => {
  try {
    const { keyword, platform = "instagram" } = req.body;
    const user = await User.findById(req.user.id).select("plan");
    const limits = getPlanLimits(user?.plan);
    const trackedCount = await TrendAlert.countDocuments({ userId: req.user.id, isTracked: true });
    if (trackedCount >= limits.trackedKeywords) {
      return res.status(403).json({ success: false, message: "Tracked keyword limit reached for your plan" });
    }

    const alert = await TrendAlert.create({
      userId: req.user.id,
      keyword,
      platform,
      mentionCount: 300 + keyword.length * 12,
      sentimentScore: 0.64,
      spike: false,
      isTracked: true,
      detectedAt: new Date(),
    });
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrendAlerts = async (req, res) => {
  try {
    await ensureSeedData();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const alerts = await TrendAlert.find({
      $or: [{ userId: null }, { userId: req.user.id }],
      spike: true,
      detectedAt: { $gte: since },
    }).sort({ mentionCount: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
