import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ 1. Connexion à la base de données
connectDB();

// ✅ 2. Configuration CORS (Très important pour Vercel)
const allowedOrigins = [
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-murex.vercel.app",
  "http://localhost:5173", // Pour le développement local
  "http://localhost:4000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme Postman ou les outils mobiles)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'La politique CORS de ce site ne permet pas l\'accès depuis l\'origine spécifiée.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ 3. Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. Fichiers statiques (Images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 5. Routes API
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ✅ 6. Route de test / Santé de l'API
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "✅ API de Food Delivery fonctionnelle",
    status: "Connecté"
  });
});

// ✅ 7. Gestion des erreurs 404 (Route non trouvée)
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// ✅ 8. Export pour Vercel
export default app;

// Optionnel: Port pour le développement local
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}