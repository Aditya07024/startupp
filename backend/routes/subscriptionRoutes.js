import { Router } from "express";
import { createOrder, getPlans, getSubscriptionStatus, verifyPayment } from "../controllers/subscriptionController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.get("/plans", getPlans);
router.get("/status", verifyToken, getSubscriptionStatus);
router.post("/create-order", verifyToken, createOrder);
router.post("/verify-payment", verifyToken, verifyPayment);

export default router;
