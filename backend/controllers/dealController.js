import BrandDeal from "../models/BrandDeal.js";
import Campaign from "../models/Campaign.js";

export const getDeals = async (req, res) => {
  try {
    const filter = req.user.role === "brand" ? { brandId: req.user.id } : {};
    const campaigns = await Campaign.find(filter).populate("brandId", "name avatar").sort({ createdAt: -1 });
    const applied = await BrandDeal.find({ creatorId: req.user.id }).populate("campaignId");
    res.json({ success: true, campaigns, applied });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDeal = async (req, res) => {
  try {
    const campaign = await Campaign.create({ ...req.body, brandId: req.user.id });
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyToDeal = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    if (!campaign.applications.includes(req.user.id)) {
      campaign.applications.push(req.user.id);
      await campaign.save();
    }

    const deal = await BrandDeal.findOneAndUpdate(
      { campaignId: campaign._id, creatorId: req.user.id },
      { brandId: campaign.brandId, payoutAmount: campaign.budget * 0.2, status: "pending" },
      { new: true, upsert: true }
    );

    res.json({ success: true, deal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await BrandDeal.find({ brandId: req.user.id })
      .populate("creatorId", "name avatar email isVerified")
      .populate("campaignId", "title budget");
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const deal = await BrandDeal.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, deal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
