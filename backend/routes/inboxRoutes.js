import { Router } from "express";
import {
  bulkReadInbox,
  getInbox,
  getInboxStats,
  markInboxRead,
  replyInbox,
  suggestReply,
} from "../controllers/inboxController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.get("/", verifyToken, requireActiveAccess, getInbox);
router.get("/stats", verifyToken, requireActiveAccess, getInboxStats);
router.post("/bulk-read", verifyToken, requireActiveAccess, bulkReadInbox);
router.patch("/:id/read", verifyToken, requireActiveAccess, markInboxRead);
router.post("/:id/reply", verifyToken, requireActiveAccess, replyInbox);
router.get("/:id/suggest-reply", verifyToken, requireActiveAccess, suggestReply);

export default router;
