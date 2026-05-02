import { Router } from "express";
import { getRepurposeHistory, repurposeContent } from "../controllers/repurposeController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.post("/", verifyToken, requireActiveAccess, repurposeContent);
router.get("/history", verifyToken, requireActiveAccess, getRepurposeHistory);

export default router;
