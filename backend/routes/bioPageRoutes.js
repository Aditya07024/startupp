import { Router } from "express";
import {
  addBioLink,
  createOrUpdateBioPage,
  deleteBioLink,
  getBioPagePublic,
  getMyBioPage,
  trackBioClick,
  updateBioLink,
} from "../controllers/bioPageController.js";
import { verifyToken } from "../middleware/auth.js";
import { requireActiveAccess } from "../middleware/access.js";

const router = Router();
router.get("/mine", verifyToken, requireActiveAccess, getMyBioPage);
router.post("/", verifyToken, requireActiveAccess, createOrUpdateBioPage);
router.post("/links", verifyToken, requireActiveAccess, addBioLink);
router.patch("/links/:id", verifyToken, requireActiveAccess, updateBioLink);
router.delete("/links/:id", verifyToken, requireActiveAccess, deleteBioLink);
router.get("/public/:slug", getBioPagePublic);
router.post("/public/:slug/click/:linkId", trackBioClick);

export default router;
