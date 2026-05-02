import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["creator", "brand", "admin"]).withMessage("Role is invalid"),
], register);
router.post("/login", [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
], login);
router.get("/me", verifyToken, me);
router.post("/logout", logout);

export default router;
