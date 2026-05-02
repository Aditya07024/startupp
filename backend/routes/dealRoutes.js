import { Router } from "express";
import { applyToDeal, createDeal, getApplications, getDeals, updateApplication } from "../controllers/dealController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();
router.get("/", verifyToken, getDeals);
router.post("/", verifyToken, requireRole("brand"), createDeal);
router.post("/:id/apply", verifyToken, requireRole("creator"), applyToDeal);
router.get("/applications", verifyToken, requireRole("brand"), getApplications);
router.patch("/applications/:id", verifyToken, requireRole("brand"), updateApplication);

export default router;
