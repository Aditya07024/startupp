import axios from "axios";
import User from "../models/User.js";

const ensureAccount = (accounts, platform) => {
  const existing = accounts.find((item) => item.platform === platform);
  if (existing) {
    return existing;
  }

  const created = {
    platform,
    handle: "",
    accessToken: "",
    refreshToken: "",
    platformUserId: "",
    isConnected: false,
    connectedAt: null,
    metrics: { followers: 0, engagement: 0, reach: 0, views: 0, change: 0, history: [], lastSyncedAt: null },
  };
  accounts.push(created);
  return accounts[accounts.length - 1];
};

const buildHistoryFromMetric = (followers, views) =>
  Array.from({ length: 6 }, (_, index) => ({
    label: `W${index + 1}`,
    followers: Math.max(0, Math.round(followers * (0.55 + index * 0.08))),
    engagement: 4 + index * 0.4,
    reach: Math.round(views * (0.45 + index * 0.08)),
    views: Math.round(views * (0.5 + index * 0.09)),
  }));

export const getSocialAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("socialAccounts");
    const accounts = ["instagram", "facebook", "youtube"].map((platform) => {
      const account = user?.socialAccounts?.find((item) => item.platform === platform);
      return {
        platform,
        handle: account?.handle || "",
        isConnected: Boolean(account?.isConnected),
        connectedAt: account?.connectedAt || null,
        platformUserId: account?.platformUserId || "",
        metrics: account?.metrics || null,
      };
    });
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const connectSocialAccount = async (req, res) => {
  try {
    const { platform, handle, accessToken, refreshToken, platformUserId } = req.body;
    if (!platform || !handle) {
      return res.status(400).json({ success: false, message: "Platform and handle are required" });
    }

    const user = await User.findById(req.user.id);
    const account = ensureAccount(user.socialAccounts, platform.toLowerCase());
    account.handle = handle;
    account.accessToken = accessToken || account.accessToken;
    account.refreshToken = refreshToken || account.refreshToken;
    account.platformUserId = platformUserId || account.platformUserId;
    account.isConnected = true;
    account.connectedAt = new Date();
    await user.save();

    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConnectInstructions = async (req, res) => {
  try {
    res.json({
      success: true,
      providers: [
        {
          platform: "instagram",
          method: "Meta Graph API user/page token",
          note: "Requires Meta app setup, Instagram professional account, and a connected Facebook Page.",
        },
        {
          platform: "facebook",
          method: "Meta Graph API page access token",
          note: "Requires Meta app setup and page insights permissions.",
        },
        {
          platform: "youtube",
          method: "Google OAuth 2.0 access token",
          note: "Requires Google Cloud OAuth consent screen and YouTube Data API enabled.",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncSocialAccount = async (req, res) => {
  try {
    const platform = req.params.platform.toLowerCase();
    const user = await User.findById(req.user.id);
    const account = user.socialAccounts.find((item) => item.platform === platform && item.isConnected);

    if (!account || !account.accessToken) {
      return res.status(400).json({ success: false, message: `Connect ${platform} with a valid access token first` });
    }

    let metrics;

    if (platform === "youtube") {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
        params: { part: "statistics,snippet", mine: true },
        headers: { Authorization: `Bearer ${account.accessToken}` },
        timeout: 30000,
      });
      const channel = response.data.items?.[0];
      metrics = {
        followers: Number(channel?.statistics?.subscriberCount || 0),
        engagement: 7.4,
        reach: Number(channel?.statistics?.viewCount || 0),
        views: Number(channel?.statistics?.viewCount || 0),
        change: 5.6,
        history: buildHistoryFromMetric(Number(channel?.statistics?.subscriberCount || 0), Number(channel?.statistics?.viewCount || 0)),
        lastSyncedAt: new Date(),
      };
      account.handle = channel?.snippet?.customUrl || account.handle;
    } else if (platform === "instagram" || platform === "facebook") {
      const response = await axios.get(`https://graph.facebook.com/v19.0/${account.platformUserId || "me"}`, {
        params: {
          fields: platform === "instagram" ? "username,followers_count,media_count" : "name,followers_count",
          access_token: account.accessToken,
        },
        timeout: 30000,
      });
      const followers = Number(response.data.followers_count || 0);
      metrics = {
        followers,
        engagement: platform === "instagram" ? 6.8 : 4.2,
        reach: followers * (platform === "instagram" ? 3 : 2),
        views: followers * (platform === "instagram" ? 4 : 2),
        change: 4.9,
        history: buildHistoryFromMetric(followers, followers * 4),
        lastSyncedAt: new Date(),
      };
      account.handle = response.data.username || response.data.name || account.handle;
    } else {
      return res.status(400).json({ success: false, message: "Unsupported platform" });
    }

    account.metrics = metrics;
    await user.save();
    res.json({ success: true, account });
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    res.status(500).json({ success: false, message });
  }
};

export const disconnectSocialAccount = async (req, res) => {
  try {
    const platform = req.params.platform.toLowerCase();
    const user = await User.findById(req.user.id);
    const account = user.socialAccounts.find((item) => item.platform === platform);

    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    account.handle = "";
    account.accessToken = "";
    account.refreshToken = "";
    account.platformUserId = "";
    account.isConnected = false;
    account.connectedAt = null;
    account.metrics = { followers: 0, engagement: 0, reach: 0, views: 0, change: 0, history: [], lastSyncedAt: null };
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
