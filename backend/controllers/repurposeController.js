import RepurposedContent from "../models/RepurposedContent.js";

const buildOutput = (platform, content) => {
  switch (platform) {
    case "Instagram Reel":
      return { platform, title: "Instagram Reel", content: `${content.slice(0, 120)}...`, hashtags: ["#viral", "#reels", "#creator", "#growth", "#ugc"] };
    case "Facebook Post":
      return { platform, title: "Facebook Post", content: `Story angle: ${content.slice(0, 180)}...`, hashtags: ["#community", "#brandstory"] };
    case "YouTube Short":
      return { platform, title: `${content.slice(0, 48)}...`, content: `Short description: ${content.slice(0, 160)}...`, tags: ["shorts", "viral", "creator"] };
    case "LinkedIn Article":
      return { platform, title: "LinkedIn Thought Piece", content: `Key insight:\n${content}\n\nTakeaway: turn this into a repeatable playbook.` };
    case "Twitter Thread":
      return { platform, title: "3-Tweet Thread", content: `1/ ${content.slice(0, 120)}\n\n2/ Main insight and proof.\n\n3/ CTA and next step.` };
    default:
      return { platform, title: platform, content };
  }
};

export const repurposeContent = async (req, res) => {
  try {
    const { sourceType, content, targetPlatforms = [] } = req.body;
    const outputs = targetPlatforms.map((platform) => buildOutput(platform, content));
    const item = await RepurposedContent.create({
      userId: req.user.id,
      sourceType,
      original: content,
      targetPlatforms,
      outputs,
    });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepurposeHistory = async (req, res) => {
  try {
    const items = await RepurposedContent.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
