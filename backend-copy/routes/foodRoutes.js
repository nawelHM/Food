import express from "express";
import {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";

import upload from "../middleware/uploads.js";

const router = express.Router();

router.post("/create", upload.single("image"), createFood);
router.get("/list", getAllFoods);
router.get("/list/:id", getFoodById);
router.put("/:id", upload.single("image"), updateFood);
router.delete("/remove/:id", deleteFood);

export default router;
