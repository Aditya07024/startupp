import { Router } from "express";
import { getAllCampaigns, getDashboard, getUsers, toggleVerifyUser } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = Router();
router.use(verifyToken, requireRole("admin"));
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id/verify", toggleVerifyUser);
router.get("/campaigns", getAllCampaigns);

export default router;
