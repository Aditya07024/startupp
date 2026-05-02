import { Router } from "express";
import { predictViralScore } from "../controllers/viralScoreController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.post("/predict", verifyToken, requireActiveAccess, predictViralScore);

export default router;
