import { Router } from "express";
import { getLiveTrends, getTrendAlerts, getTrendMentions, trackKeyword } from "../controllers/trendController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.get("/live", verifyToken, requireActiveAccess, getLiveTrends);
router.get("/mentions", verifyToken, requireActiveAccess, getTrendMentions);
router.post("/track", verifyToken, requireActiveAccess, trackKeyword);
router.get("/alerts", verifyToken, requireActiveAccess, getTrendAlerts);

export default router;
