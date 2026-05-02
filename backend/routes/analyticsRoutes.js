import { Router } from "express";
import { getBestTime, getOverview } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.get("/overview", verifyToken, requireActiveAccess, getOverview);
router.get("/best-time", verifyToken, requireActiveAccess, getBestTime);

export default router;
