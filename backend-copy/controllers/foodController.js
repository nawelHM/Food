import FoodModel from "../models/foodModel.js";
import fs from "fs";     // ⛔ inutilisé avec Cloudinary (mais gardé comme demandé)
import path from "path"; // ⛔ inutilisé avec Cloudinary (mais gardé comme demandé)

// 🟢 CREATE FOOD (Cloudinary)
export const createFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // ✅ Cloudinary fournit directement une URL publique
    const image = req.file ? req.file.path : null;

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

// 🔹 GET ALL FOODS
export const getAllFoods = async (req, res) => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET FOOD BY ID
export const getFoodById = async (req, res) => {
  try {
    const food = await FoodModel.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE FOOD (Cloudinary)
export const updateFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const updateData = { name, description, price, category };

    // ✅ nouvelle image Cloudinary
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedFood = await FoodModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 DELETE FOOD (Cloudinary safe)
export const deleteFood = async (req, res) => {
  try {
    const food = await FoodModel.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // ❌ PLUS DE fs.unlink
    // Cloudinary gère le stockage, pas le serveur

    await FoodModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
