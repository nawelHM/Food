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

// --- 1. CONFIGURATION DES ORIGINES ---
const allowedOrigins = [
  "https://food-front-murex.vercel.app",
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "http://localhost:5173"
];

// --- 2. MIDDLEWARE DE LOG ET FIX PREFLIGHT ---
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${origin || "Direct"}`);

  // Force les headers manuellement pour être sûr que Vercel les voit
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

  // RÉPONSE IMMÉDIATE POUR OPTIONS (PREFLIGHT)
  // C'est l'étape qui échoue souvent sur Vercel
  if (req.method === "OPTIONS") {
    console.log("✅ Preflight OPTIONS handled successfully");
    return res.status(204).end();
  }
  next();
});

// --- 3. CONFIGURATION CORS OFFICIELLE ---
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`❌ CORS check FAILED for: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// --- 4. ANALYSE DU CORPS ET DB ---
app.use(express.json());
connectDB()
  .then(() => console.log("💾 Database connected"))
  .catch(err => console.error("💾 DB Error:", err));

// --- 5. ROUTES STATIQUES ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 6. ROUTES API ---
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).send("✅ API Working on Vercel");
});

// --- 7. GESTION D'ERREUR ---
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: "CORS Violation", origin: req.headers.origin });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;