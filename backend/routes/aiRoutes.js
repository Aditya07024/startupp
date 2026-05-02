import { Router } from "express";
import { analyzeReel, generateAIContent, generateReelIdeas, getHistory } from "../controllers/aiController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.post("/generate", verifyToken, requireActiveAccess, generateAIContent);
router.post("/reel-ideas", verifyToken, requireActiveAccess, generateReelIdeas);
router.post("/analyze", verifyToken, requireActiveAccess, analyzeReel);
router.get("/history", verifyToken, requireActiveAccess, getHistory);

export default router;
