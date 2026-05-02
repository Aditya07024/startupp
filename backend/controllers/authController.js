import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "creator",
  avatar: user.avatar,
  bio: user.bio,
  isVerified: user.isVerified,
  plan: user.plan,
  trialEndsAt: user.trialEndsAt,
  subscriptionStatus: user.subscriptionStatus,
  wallet: user.wallet,
  referralCode: user.referralCode,
  socialAccounts: user.socialAccounts,
  createdAt: user.createdAt,
});

const resolvePasswordHash = async (user, password) => {
  if (user.passwordHash) {
    return { valid: await bcrypt.compare(password, user.passwordHash), passwordHash: user.passwordHash };
  }

  // Support legacy records that stored `password` instead of `passwordHash`.
  const rawUser = await User.collection.findOne({ _id: user._id });
  const legacyPassword = rawUser?.password;

  if (!legacyPassword) {
    return { valid: false, passwordHash: null };
  }

  const looksHashed = typeof legacyPassword === "string" && legacyPassword.startsWith("$2");
  const valid = looksHashed ? await bcrypt.compare(password, legacyPassword) : password === legacyPassword;

  if (!valid) {
    return { valid: false, passwordHash: null };
  }

  const passwordHash = looksHashed ? legacyPassword : await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { $set: { passwordHash }, $unset: { password: "" } });

  return { valid: true, passwordHash };
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, password, role, referredByCode } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const referredBy = referredByCode ? await User.findOne({ referralCode: referredByCode }) : null;
    const passwordHash = await bcrypt.hash(password, 10);
    const trialEndsAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      trialEndsAt,
      subscriptionStatus: "trial",
      referralCode: nanoid(8),
      referredBy: referredBy?._id,
    });

    const token = signToken(user);
    res.status(201).json({ success: true, token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { valid } = await resolvePasswordHash(user, password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.json({ success: true, message: "Logged out" });
};
