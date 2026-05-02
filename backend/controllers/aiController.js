import AIContent from "../models/AIContent.js";
import { generateContentFromAI } from "../utils/huggingface.js";

export const generateAIContent = async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: "Topic is required" });
    }

    const generated = await generateContentFromAI(topic);
    const payload = {
      userId: req.user.id,
      topic,
      hook: generated.hook || "No hook generated",
      script: generated.script || "No script generated",
      caption: generated.caption || "No caption generated",
      hashtags: generated.hashtags || [],
    };

    let content;
    try {
      content = await AIContent.create(payload);
    } catch {
      // Do not fail the user-facing AI request if history persistence breaks.
      content = payload;
    }

    res.json({ success: true, content });
  } catch (error) {
    const message = error.code === "ECONNABORTED" ? "AI generation timed out. Please retry." : error.message;
    res.status(500).json({ success: false, message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await AIContent.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReelIdeas = async (req, res) => {
  try {
    const { topic } = req.body;
    const generated = await generateContentFromAI(topic || "content growth");
    res.json({ success: true, ideas: generated.reelIdeas || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeReel = async (req, res) => {
  try {
    const { topic } = req.body;
    const generated = await generateContentFromAI(topic || "content growth");
    res.json({ success: true, analysis: generated.analyzer || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
