import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { getRazorpayClient } from "../utils/razorpay.js";

const plans = [
  { id: "basic", name: "Basic", amount: 499, features: ["Core dashboard", "AI captions", "Wallet tracking"] },
  { id: "pro", name: "Pro", amount: 999, features: ["All Basic", "Deals CRM", "Priority analytics"] },
  { id: "premium", name: "Premium", amount: 1499, features: ["All Pro", "Admin insights", "Premium support"] },
];

export const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("plan trialEndsAt subscriptionStatus role");
    const latest = await Subscription.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      status: {
        plan: user?.plan || "basic",
        role: user?.role,
        trialEndsAt: user?.trialEndsAt,
        subscriptionStatus: user?.subscriptionStatus || "trial",
        latestSubscription: latest,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlans = async (req, res) => {
  res.json({ success: true, plans });
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const selected = plans.find((item) => item.id === plan);
    if (!selected) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const order = await getRazorpayClient().orders.create({
      amount: selected.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Subscription.create({
      userId: req.user.id,
      plan,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const digest = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    await Subscription.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, status: "paid", startDate, endDate },
      { new: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { plan, subscriptionStatus: "active" },
      { new: true }
    ).select("-passwordHash");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
