import User from "../models/User.js";

const defaultMetrics = { followers: 0, engagement: 0, reach: 0, views: 0, change: 0 };

const buildHistory = (socialAccounts) => {
  const labels = ["W1", "W2", "W3", "W4", "W5", "W6"];
  return labels.map((label, index) => {
    const point = { month: label };
    for (const platformKey of ["instagram", "facebook", "youtube"]) {
      const social = socialAccounts.find((account) => account.platform === platformKey);
      point[platformKey] = social?.metrics?.history?.[index]?.followers || 0;
    }
    return point;
  });
};

export const getOverview = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("socialAccounts");
    const socialAccounts = user?.socialAccounts || [];
    const byPlatform = Object.fromEntries(
      ["instagram", "facebook", "youtube"].map((platform) => {
        const connected = socialAccounts.find((account) => account.platform === platform);
        return [
          platform,
          {
            ...defaultMetrics,
            ...(connected?.metrics ? connected.metrics.toObject?.() || connected.metrics : {}),
            connected: Boolean(connected?.isConnected),
            handle: connected?.handle || "",
            lastSyncedAt: connected?.metrics?.lastSyncedAt || null,
          },
        ];
      })
    );

    res.json({
      success: true,
      data: {
        ...byPlatform,
        growthHistory: buildHistory(socialAccounts),
        sources: socialAccounts.map((account) => ({
          platform: account.platform,
          handle: account.handle,
          connected: account.isConnected,
          lastSyncedAt: account.metrics?.lastSyncedAt || null,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestTime = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("socialAccounts");
    const connectedPlatforms = (user?.socialAccounts || []).filter((account) => account.isConnected);
    const bestTimes = connectedPlatforms.length
      ? connectedPlatforms.map((account) => ({
          platform: account.platform.charAt(0).toUpperCase() + account.platform.slice(1),
          slot:
            account.platform === "instagram"
              ? "7:30 PM - 9:00 PM"
              : account.platform === "facebook"
                ? "1:00 PM - 3:00 PM"
                : "6:00 PM - 8:00 PM",
        }))
      : [
          { platform: "Instagram", slot: "7:30 PM - 9:00 PM" },
          { platform: "Facebook", slot: "1:00 PM - 3:00 PM" },
          { platform: "YouTube", slot: "6:00 PM - 8:00 PM" },
        ];

    res.json({
      success: true,
      data: {
        bestTimes,
        trendingTopics: ["Home workout transformation", "AI creator hacks", "High-converting hooks", "UGC revenue tips"],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
