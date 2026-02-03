import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.post("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
