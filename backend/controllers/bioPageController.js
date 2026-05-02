import { nanoid } from "nanoid";
import BioPage from "../models/BioPage.js";
import User from "../models/User.js";

const ensureBioPage = async (userId) => {
  let page = await BioPage.findOne({ userId });
  if (!page) {
    const user = await User.findById(userId).select("name avatar bio");
    page = await BioPage.create({
      userId,
      slug: `${user.name || "creator"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${nanoid(4).toLowerCase()}`,
      title: user.name,
      bio: user.bio,
      avatar: user.avatar,
      links: [],
    });
  }
  return page;
};

export const getBioPagePublic = async (req, res) => {
  try {
    const page = await BioPage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: "Bio page not found" });
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateBioPage = async (req, res) => {
  try {
    const page = await ensureBioPage(req.user.id);
    Object.assign(page, req.body);
    await page.save();
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBioPage = async (req, res) => {
  try {
    const page = await ensureBioPage(req.user.id);
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addBioLink = async (req, res) => {
  try {
    const page = await ensureBioPage(req.user.id);
    page.links.push({ ...req.body, order: page.links.length });
    await page.save();
    res.status(201).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBioLink = async (req, res) => {
  try {
    const page = await ensureBioPage(req.user.id);
    const link = page.links.id(req.params.id);
    Object.assign(link, req.body);
    await page.save();
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBioLink = async (req, res) => {
  try {
    const page = await ensureBioPage(req.user.id);
    page.links = page.links.filter((link) => String(link._id) !== req.params.id);
    await page.save();
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackBioClick = async (req, res) => {
  try {
    const page = await BioPage.findOne({ slug: req.params.slug });
    const link = page.links.id(req.params.linkId);
    link.clicks += 1;
    page.totalClicks += 1;
    await page.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
