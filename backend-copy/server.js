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

// --- LOG DE DÉMARRAGE ---
console.log("🚀 Server starting in", process.env.NODE_ENV || "development", "mode");

// --- 1. PRIORITÉ ABSOLUE : CORS AVEC LOGS ---
const allowedOrigins = [
  "https://food-front-murex.vercel.app",
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "http://localhost:5173"
];

// Middleware de log pour voir CHAQUE requête entrante
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`🔗 Origin: ${req.headers.origin || "No Origin (Direct Access)"}`);
  next();
});

// Remplacez app.use(cors(...)) par ceci :
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        "https://food-front-murex.vercel.app",
        "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
        "http://localhost:5173"
    ];

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // IMPORTANT : Répondre immédiatement aux requêtes de pré-vérification
    if (req.method === 'OPTIONS') {
        console.log(`✅ Preflight OPTIONS handled for ${origin}`);
        return res.status(204).end();
    }
    
    next();
});
// --- 2. ANALYSE DU CORPS ---
app.use(express.json());

// --- 3. CONNEXION DATABASE ---
connectDB()
  .then(() => console.log("💾 Database connected successfully"))
  .catch(err => console.error("💾 Database connection error:", err));

// --- 4. ROUTES STATIQUES ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 5. ROUTES API ---
// Petit log pour confirmer le chargement des routes
console.log("🛣️ Loading API routes...");
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// --- 6. HEALTH CHECK ---
app.get("/", (req, res) => {
  res.status(200).send("✅ API Working on Vercel");
});

// --- 7. GESTION D'ERREUR GLOBALE ---
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.error("🚫 Blocked by CORS policy");
    res.status(403).json({ error: "CORS Policy Violation", origin: req.headers.origin });
  } else {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;