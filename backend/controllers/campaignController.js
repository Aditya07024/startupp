import Campaign from "../models/Campaign.js";
import BrandDeal from "../models/BrandDeal.js";
import User from "../models/User.js";

export const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({ ...req.body, brandId: req.user.id });
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ brandId: req.user.id }).sort({ createdAt: -1 });
    const enriched = await Promise.all(
      campaigns.map(async (campaign) => ({
        ...campaign.toObject(),
        applicants: await User.find({ _id: { $in: campaign.applications } }).select("name email avatar isVerified"),
      }))
    );
    res.json({ success: true, campaigns: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandDashboard = async (req, res) => {
  try {
    const [campaigns, applications] = await Promise.all([
      Campaign.find({ brandId: req.user.id }).sort({ createdAt: -1 }),
      BrandDeal.find({ brandId: req.user.id })
        .populate("creatorId", "name avatar email isVerified")
        .populate("campaignId", "title budget"),
    ]);

    const budgetSpent = campaigns.reduce((sum, item) => sum + (item.budget || 0), 0);
    const totalReach = campaigns.reduce((sum, item) => sum + (item.reach || 0), 0);

    res.json({
      success: true,
      data: {
        stats: {
          activeCampaigns: campaigns.filter((campaign) => ["open", "active"].includes(campaign.status)).length,
          totalApplications: applications.length,
          totalReach,
          budgetSpent,
        },
        chart: [
          { label: "Campaigns", value: campaigns.length },
          { label: "Applications", value: applications.length },
          { label: "Reach", value: totalReach },
          { label: "Budget", value: Math.round(budgetSpent || 0) },
        ],
        campaigns,
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate({ _id: req.params.id, brandId: req.user.id }, req.body, { new: true });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignStats = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).select("reach engagement clicks");
    res.json({ success: true, stats: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
