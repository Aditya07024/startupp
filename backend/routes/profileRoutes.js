import { Router } from "express";
import {
  addPortfolioItem,
  deletePortfolioItem,
  generateMediaKit,
  getMyProfile,
  getPublicProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.get("/me", verifyToken, requireActiveAccess, getMyProfile);
router.post("/portfolio", verifyToken, requireActiveAccess, addPortfolioItem);
router.delete("/portfolio/:id", verifyToken, requireActiveAccess, deletePortfolioItem);
router.post("/mediakit/generate", verifyToken, requireActiveAccess, generateMediaKit);
router.get("/:username", getPublicProfile);

export default router;
