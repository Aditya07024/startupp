import { Router } from "express";
import {
  deleteCompetitor,
  getCompetitorAnalysis,
  getCompetitors,
  trackCompetitor,
} from "../controllers/competitorController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.post("/track", verifyToken, requireActiveAccess, trackCompetitor);
router.get("/list", verifyToken, requireActiveAccess, getCompetitors);
router.get("/:id/analysis", verifyToken, requireActiveAccess, getCompetitorAnalysis);
router.delete("/:id", verifyToken, requireActiveAccess, deleteCompetitor);

export default router;
