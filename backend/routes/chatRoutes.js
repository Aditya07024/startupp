import { Router } from "express";
import { getConversations, getMessages, sendMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.get("/conversations", verifyToken, getConversations);
router.get("/conversations/:id/messages", verifyToken, getMessages);
router.post("/conversations/:id/messages", verifyToken, sendMessage);

export default router;
