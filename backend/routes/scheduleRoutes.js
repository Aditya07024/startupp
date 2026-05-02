import { Router } from "express";
import { createScheduledPost, deleteScheduledPost, getScheduledPosts } from "../controllers/scheduleController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();
router.post("/", verifyToken, createScheduledPost);
router.get("/", verifyToken, getScheduledPosts);
router.delete("/:id", verifyToken, deleteScheduledPost);

export default router;
