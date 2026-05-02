import { Router } from "express";
import { claimReferral, getWallet, withdraw } from "../controllers/walletController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.get("/", verifyToken, getWallet);
router.post("/withdraw", verifyToken, withdraw);
router.post("/referral/claim", verifyToken, claimReferral);

export default router;
