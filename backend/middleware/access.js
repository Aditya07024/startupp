import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export const hasActiveAccess = async (userId) => {
  const user = await User.findById(userId).select("role trialEndsAt subscriptionStatus plan");
  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  if (user.role === "admin") {
    return { allowed: true, user };
  }

  const now = new Date();
  if (!user.trialEndsAt) {
    const trialEndsAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    await User.updateOne(
      { _id: userId },
      { $set: { trialEndsAt, subscriptionStatus: user.subscriptionStatus || "trial" } }
    );
    user.trialEndsAt = trialEndsAt;
    user.subscriptionStatus = user.subscriptionStatus || "trial";
  }

  if (user.trialEndsAt && user.trialEndsAt > now) {
    return { allowed: true, user, accessType: "trial" };
  }

  const activeSubscription = await Subscription.findOne({
    userId,
    status: "paid",
    endDate: { $gt: now },
  }).sort({ endDate: -1 });

  if (activeSubscription) {
    if (user.subscriptionStatus !== "active") {
      await User.updateOne({ _id: userId }, { $set: { subscriptionStatus: "active", plan: activeSubscription.plan } });
    }
    return { allowed: true, user, accessType: "subscription", subscription: activeSubscription };
  }

  if (user.subscriptionStatus !== "expired") {
    await User.updateOne({ _id: userId }, { $set: { subscriptionStatus: "expired" } });
  }

  return { allowed: false, reason: "Your 2-day trial has ended. Subscribe to continue using premium features." };
};

export const requireActiveAccess = async (req, res, next) => {
  try {
    const access = await hasActiveAccess(req.user.id);
    if (!access.allowed) {
      return res.status(402).json({ success: false, message: access.reason });
    }

    req.access = access;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
