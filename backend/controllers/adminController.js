import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const monthLabel = (date) =>
  date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

const buildGrowthData = (users) => {
  const now = new Date();
  const months = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (4 - index), 1));
    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      month: monthLabel(date),
      instagram: 0,
      facebook: 0,
      youtube: 0,
    };
  });

  for (const user of users) {
    const createdAt = new Date(user.createdAt);
    const key = `${createdAt.getUTCFullYear()}-${createdAt.getUTCMonth()}`;
    const bucket = months.find((item) => item.key === key);
    if (!bucket) continue;

    if (user.role === "creator") bucket.instagram += 1;
    if (user.role === "brand") bucket.facebook += 1;
    if (user.role === "admin") bucket.youtube += 1;
  }

  return months.map(({ key, ...rest }) => rest);
};

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, creators, brands, activeCampaigns, transactions, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "creator" }),
      User.countDocuments({ role: "brand" }),
      Campaign.countDocuments({ status: { $in: ["open", "active"] } }),
      Transaction.find(),
      User.find().select("role createdAt").sort({ createdAt: -1 }).limit(200),
    ]);

    const revenue = transactions.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + tx.amount, 0);
    const payouts = transactions.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        creators,
        brands,
        revenue,
        payouts,
        activeCampaigns,
        growthData: buildGrowthData(recentUsers),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const users = await User.find().select("-passwordHash").skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments();
    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleVerifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("brandId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
