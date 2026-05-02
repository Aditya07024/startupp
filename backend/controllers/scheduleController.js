import ScheduledPost from "../models/ScheduledPost.js";

export const createScheduledPost = async (req, res) => {
  try {
    const post = await ScheduledPost.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getScheduledPosts = async (req, res) => {
  try {
    const posts = await ScheduledPost.find({ userId: req.user.id }).sort({ scheduledAt: 1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteScheduledPost = async (req, res) => {
  try {
    await ScheduledPost.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
