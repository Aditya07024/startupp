import { Router } from "express";
import { createCampaign, getCampaignStats, getMyCampaigns, updateCampaign } from "../controllers/campaignController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();
router.post("/", verifyToken, requireRole("brand"), createCampaign);
router.get("/my", verifyToken, requireRole("brand"), getMyCampaigns);
router.patch("/:id", verifyToken, requireRole("brand"), updateCampaign);
router.get("/:id/stats", verifyToken, getCampaignStats);

export default router;
