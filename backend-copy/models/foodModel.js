import mongoose from 'mongoose';

// Définition du schéma
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
    
  },
  { timestamps: true } // créé createdAt et updatedAt automatiquement
);

// Création du modèle
const FoodModel = mongoose.model.food || mongoose.model('Food', foodSchema);

// Export du modèle
export default FoodModel;
