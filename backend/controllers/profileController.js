import { nanoid } from "nanoid";
import BrandDeal from "../models/BrandDeal.js";
import CreatorProfile from "../models/CreatorProfile.js";
import User from "../models/User.js";
import { formatFollowerRange } from "../utils/plan.js";

const ensureProfile = async (userId) => {
  let profile = await CreatorProfile.findOne({ userId });
  if (!profile) {
    const user = await User.findById(userId).select("name role socialAccounts");
    profile = await CreatorProfile.create({
      userId,
      username: `${user.name || "creator"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${nanoid(4).toLowerCase()}`,
      niche: user.role === "brand" ? "brand" : "creator",
      followerRanges: {
        instagram: formatFollowerRange(user.socialAccounts?.find((a) => a.platform === "instagram")?.metrics?.followers),
        facebook: formatFollowerRange(user.socialAccounts?.find((a) => a.platform === "facebook")?.metrics?.followers),
        youtube: formatFollowerRange(user.socialAccounts?.find((a) => a.platform === "youtube")?.metrics?.followers),
      },
    });
  }
  return profile;
};

export const getPublicProfile = async (req, res) => {
  try {
    const profile = await CreatorProfile.findOne({ username: req.params.username.toLowerCase() });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    const user = await User.findById(profile.userId).select("name avatar bio socialAccounts");
    const pastDeals = await BrandDeal.find({ creatorId: profile.userId, status: { $in: ["active", "completed"] } }).limit(6);
    res.json({
      success: true,
      profile: {
        name: user?.name,
        avatar: user?.avatar,
        bio: user?.bio,
        niche: profile.niche,
        username: profile.username,
        followerRanges: profile.followerRanges,
        platforms: user?.socialAccounts || [],
        stats: profile.stats,
        portfolio: profile.portfolio,
        pastDeals,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPortfolioItem = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.id);
    profile.portfolio.push(req.body);
    await profile.save();
    res.status(201).json({ success: true, portfolio: profile.portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolioItem = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.id);
    profile.portfolio = profile.portfolio.filter((item) => String(item._id) !== req.params.id);
    await profile.save();
    res.json({ success: true, portfolio: profile.portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.id);
    const user = await User.findById(req.user.id).select("name avatar bio socialAccounts plan");
    res.json({ success: true, profile: { ...profile.toObject(), user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateMediaKit = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.id);
    profile.mediaKit = {
      generated: true,
      downloadUrl: `/media-kit/${profile.username}.pdf`,
    };
    await profile.save();
    res.json({ success: true, mediaKit: profile.mediaKit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
