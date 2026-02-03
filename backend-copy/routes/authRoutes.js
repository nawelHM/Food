import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ ROUTE MANQUANTE (OBLIGATOIRE)
router.get("/verify/:token", verifyEmail);

export default router;
