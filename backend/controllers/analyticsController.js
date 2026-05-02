import User from "../models/User.js";

const defaultMetrics = { followers: 0, engagement: 0, reach: 0, views: 0, change: 0 };
const platformColors = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  facebook: "#1877F2",
};

const formatPlatformName = (platform = "") => platform.charAt(0).toUpperCase() + platform.slice(1);

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

const buildTopPlatforms = (socialAccounts) => {
  const connected = socialAccounts.filter((account) => account.isConnected);
  const totalFollowers = connected.reduce((sum, account) => sum + (account.metrics?.followers || 0), 0);

  return connected.map((account) => {
    const followers = account.metrics?.followers || 0;
    const value = totalFollowers > 0 ? Math.round((followers / totalFollowers) * 100) : 0;
    return {
      name: formatPlatformName(account.platform),
      key: account.platform,
      value,
      color: platformColors[account.platform] || "#94A3B8",
    };
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
    const primaryPlatform = socialAccounts.find((account) => account.platform === "instagram" && account.isConnected)
      || socialAccounts.find((account) => account.isConnected)
      || null;
    const topPlatforms = buildTopPlatforms(socialAccounts);

    res.json({
      success: true,
      data: {
        ...byPlatform,
        summary: {
          followers: primaryPlatform?.metrics?.followers || 0,
          engagement: primaryPlatform?.metrics?.engagement || 0,
          impressions: primaryPlatform?.metrics?.reach || 0,
          profileVisits: primaryPlatform?.metrics?.views || 0,
          followerChange: primaryPlatform?.metrics?.change || 0,
        },
        growthHistory: buildHistory(socialAccounts),
        topPlatforms,
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
    const bestTimes = connectedPlatforms.map((account) => ({
      platform: formatPlatformName(account.platform),
      slot:
        account.platform === "instagram"
          ? "7:30 PM - 9:00 PM"
          : account.platform === "facebook"
            ? "1:00 PM - 3:00 PM"
            : "6:00 PM - 8:00 PM",
    }));

    res.json({
      success: true,
      data: {
        bestTimes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
