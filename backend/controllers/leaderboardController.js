import BrandDeal from "../models/BrandDeal.js";
import CreatorProfile from "../models/CreatorProfile.js";
import LeaderboardEntry from "../models/LeaderboardEntry.js";
import User from "../models/User.js";

const badgeForPercentile = (index, total) => {
  const percentile = ((index + 1) / total) * 100;
  if (percentile <= 1) return "Legend";
  if (percentile <= 5) return "Elite";
  if (percentile <= 20) return "Verified";
  return "Rising";
};

export const recalculateLeaderboard = async (period = "weekly") => {
  const creators = await User.find({ role: "creator" }).select("name avatar socialAccounts");
  await LeaderboardEntry.deleteMany({ period });
  const rows = await Promise.all(
    creators.map(async (user) => {
      const completedDeals = await BrandDeal.countDocuments({ creatorId: user._id, status: "completed" });
      const instagram = user.socialAccounts.find((account) => account.platform === "instagram");
      const followerGrowth = instagram?.metrics?.change || 0;
      const engagementRate = instagram?.metrics?.engagement || 0;
      const score = followerGrowth * 0.3 + engagementRate * 0.4 + completedDeals * 0.3;
      const profile = await CreatorProfile.findOne({ userId: user._id });
      return {
        userId: user._id,
        niche: profile?.niche || "creator",
        platform: "instagram",
        period,
        score,
        engagementRate,
        dealsCompleted: completedDeals,
        followerGrowth,
      };
    })
  );
  rows.sort((a, b) => b.score - a.score);
  await LeaderboardEntry.insertMany(
    rows.map((row, index) => ({
      ...row,
      rank: index + 1,
      badge: badgeForPercentile(index, rows.length || 1),
    }))
  );
};

export const getLeaderboard = async (req, res) => {
  try {
    const period = req.query.period || "weekly";
    const niche = req.query.niche;
    const platform = req.query.platform || "instagram";
    let items = await LeaderboardEntry.find({ period, platform }).sort({ rank: 1 }).limit(50);
    if (!items.length) {
      await recalculateLeaderboard(period);
      items = await LeaderboardEntry.find({ period, platform }).sort({ rank: 1 }).limit(50);
    }
    if (niche) items = items.filter((item) => item.niche === niche);
    const enriched = await Promise.all(
      items.map(async (item) => {
        const user = await User.findById(item.userId).select("name avatar");
        const profile = await CreatorProfile.findOne({ userId: item.userId }).select("username");
        return { ...item.toObject(), name: user?.name, avatar: user?.avatar, username: profile?.username };
      })
    );
    const yourRank = req.user ? enriched.find((item) => String(item.userId) === String(req.user.id)) || null : null;
    res.json({ success: true, items: enriched, yourRank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
