import InboxMessage from "../models/InboxMessage.js";
import User from "../models/User.js";
import { getPlanLimits } from "../utils/plan.js";

const seedInbox = async (userId) => {
  const count = await InboxMessage.countDocuments({ userId });
  if (count) return;
  await InboxMessage.insertMany([
    { userId, platform: "instagram", type: "dm", senderName: "Fitness Brand", content: "Loved your reel. Interested in a paid collab?" },
    { userId, platform: "facebook", type: "comment", senderName: "Health Store", content: "Can you share the product link?" },
    { userId, platform: "youtube", type: "mention", senderName: "Sports Wear", content: "We featured your clip in our roundup." },
  ]);
};

export const getInbox = async (req, res) => {
  try {
    await seedInbox(req.user.id);
    const query = { userId: req.user.id };
    if (req.query.platform && req.query.platform !== "all") query.platform = req.query.platform;
    if (req.query.type && req.query.type !== "all") query.type = req.query.type;
    if (req.query.read === "true") query.isRead = true;
    if (req.query.read === "false") query.isRead = false;
    const messages = await InboxMessage.find(query).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markInboxRead = async (req, res) => {
  try {
    const message = await InboxMessage.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { isRead: true }, { new: true });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyInbox = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("plan");
    if (req.body.aiSuggested && !getPlanLimits(user?.plan).aiReply) {
      return res.status(403).json({ success: false, message: "AI reply suggestions require Pro or Premium" });
    }
    const message = await InboxMessage.findOne({ _id: req.params.id, userId: req.user.id });
    message.replies.push({ body: req.body.body, aiSuggested: Boolean(req.body.aiSuggested) });
    message.repliedAt = new Date();
    message.isRead = true;
    await message.save();
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInboxStats = async (req, res) => {
  try {
    await seedInbox(req.user.id);
    const unread = await InboxMessage.aggregate([
      { $match: { userId: req.user._id || req.user.id, isRead: false } },
      { $group: { _id: "$platform", count: { $sum: 1 } } },
    ]);
    res.json({ success: true, stats: unread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkReadInbox = async (req, res) => {
  try {
    await InboxMessage.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suggestReply = async (req, res) => {
  try {
    const message = await InboxMessage.findOne({ _id: req.params.id, userId: req.user.id });
    res.json({
      success: true,
      reply: `Thanks ${message.senderName}, appreciate the message. I’m interested. Please share the campaign goals, deliverables, and timeline so I can review the fit.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
