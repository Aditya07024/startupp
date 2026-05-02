import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("wallet referralCode");
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, wallet: user.wallet, referralCode: user.referralCode, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    if (user.wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    user.wallet.balance -= amount;
    user.wallet.pendingBalance += amount;
    await user.save();
    await Transaction.create({ userId: user._id, type: "debit", amount, description: "Withdrawal requested" });
    res.json({ success: true, wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const claimReferral = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.referredBy) {
      return res.status(400).json({ success: false, message: "No referral linked to this account" });
    }

    user.wallet.balance += 50;
    user.referredBy = undefined;
    await user.save();
    await Transaction.create({ userId: user._id, type: "credit", amount: 50, description: "Referral reward credited" });
    res.json({ success: true, wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
