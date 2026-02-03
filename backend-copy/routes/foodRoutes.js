import express from "express";
import {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import multer from "multer";

const router = express.Router();

// 🔹 Image storage engine
const storage = multer.diskStorage({  // ❌ Tu avais écrit "diskStrorae"
  destination: (req, file, cb) => {
    cb(null, "uploads"); // dossier où les images seront sauvegardées
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // renomme l'image
  },
});

const upload = multer({ storage }); // ❌ tu avais écrit "storadge:storadge"

// Routes
router.post("/create", upload.single("image"), createFood);
router.get("/list", getAllFoods);
router.get("/list/:id", getFoodById);
router.put("/:id", updateFood);
router.delete("/remove/:id", deleteFood);

export default router;
