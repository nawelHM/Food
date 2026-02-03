import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { createOrder, getOrders, getAllOrdersForAdmin } from "../controllers/orderController.js";

const router = express.Router();

// User routes
router.post("/create", authMiddleware, createOrder);
router.get("/list", authMiddleware, getOrders);

// Admin route
router.get("/all", authMiddleware, adminMiddleware, getAllOrdersForAdmin);

export default router;
