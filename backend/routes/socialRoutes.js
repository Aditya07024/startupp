import { Router } from "express";
import {
  connectSocialAccount,
  disconnectSocialAccount,
  getConnectInstructions,
  getSocialAccounts,
  syncSocialAccount,
} from "../controllers/socialController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();

router.get("/", verifyToken, requireActiveAccess, getSocialAccounts);
router.get("/instructions", verifyToken, requireActiveAccess, getConnectInstructions);
router.post("/connect", verifyToken, requireActiveAccess, connectSocialAccount);
router.post("/:platform/sync", verifyToken, requireActiveAccess, syncSocialAccount);
router.delete("/:platform", verifyToken, requireActiveAccess, disconnectSocialAccount);

export default router;
