import { Router } from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.get("/", verifyToken, getLeaderboard);

export default router;
