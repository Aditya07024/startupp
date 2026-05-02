import CompetitorWatch from "../models/CompetitorWatch.js";
import User from "../models/User.js";
import { getPlanLimits } from "../utils/plan.js";

const sampleSnapshot = (handle) => ({
  followers: 10000 + handle.length * 1200,
  engagement: 4.5 + (handle.length % 4),
  postsPerWeek: 3 + (handle.length % 5),
  topHashtags: ["#ugc", "#creator", "#viral", "#growth"],
  capturedAt: new Date(),
});

export const trackCompetitor = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("plan");
    const count = await CompetitorWatch.countDocuments({ userId: req.user.id });
    if (count >= getPlanLimits(user?.plan).competitors) {
      return res.status(403).json({ success: false, message: "Competitor tracking limit reached for your plan" });
    }
    const item = await CompetitorWatch.create({
      userId: req.user.id,
      handle: req.body.handle,
      platform: req.body.platform,
      niche: req.body.niche,
      snapshots: [sampleSnapshot(req.body.handle)],
    });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompetitors = async (req, res) => {
  try {
    const items = await CompetitorWatch.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompetitorAnalysis = async (req, res) => {
  try {
    const item = await CompetitorWatch.findOne({ _id: req.params.id, userId: req.user.id });
    const latest = item.snapshots.at(-1);
    const trend = item.snapshots.slice(-4);
    res.json({
      success: true,
      analysis: {
        latest,
        trend,
        contentGap: [
          "Behind-the-scenes proof content",
          "Before/after transformations",
          "Stronger customer testimonial angles",
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCompetitor = async (req, res) => {
  try {
    await CompetitorWatch.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
