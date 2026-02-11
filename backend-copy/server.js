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

app.use(cors({
  origin: function (origin, callback) {
    // Si pas d'origine (ex: Postman ou accès direct via navigateur), on accepte
    if (!origin) {
      console.log("✅ Request with no origin allowed");
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`✅ CORS check passed for: ${origin}`);
      callback(null, true);
    } else {
      console.error(`❌ CORS check FAILED for: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

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