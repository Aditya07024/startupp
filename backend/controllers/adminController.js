import Campaign from "../models/Campaign.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, creators, brands, activeCampaigns, transactions] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "creator" }),
      User.countDocuments({ role: "brand" }),
      Campaign.countDocuments({ status: { $in: ["open", "active"] } }),
      Transaction.find(),
    ]);

    const revenue = transactions.filter((tx) => tx.type === "credit").reduce((sum, tx) => sum + tx.amount, 0);
    const payouts = transactions.filter((tx) => tx.type === "debit").reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      success: true,
      data: { totalUsers, creators, brands, revenue, payouts, activeCampaigns },
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
