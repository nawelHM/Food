import FoodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// 🟢 Créer un nouvel aliment avec image
export const createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Si multer a uploadé un fichier
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newFood = new FoodModel({
      name,
      description,
      price,
      category,
      image,
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Obtenir tous les aliments
export const getAllFoods = async (req, res) => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Obtenir un aliment par ID
export const getFoodById = async (req, res) => {
  try {
    const food = await FoodModel.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Mettre à jour un aliment
export const updateFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    let updateData = { name, description, price, category };

    // Si une nouvelle image est uploadée
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFood) return res.status(404).json({ message: "Food not found" });

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await FoodModel.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food not found" });

    // 🔹 Supprimer l'image du dossier uploads si elle existe
    if (food.image) {
      const imagePath = path.join(process.cwd(), food.image); // /uploads/filename.jpg

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn("⚠️ Image not found or already deleted:", imagePath);
        } else {
          console.log("🗑️ Image deleted:", imagePath);
        }
      });
    }

    // 🔹 Supprimer le document MongoDB
    await FoodModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Food + image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
