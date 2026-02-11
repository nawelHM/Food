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

const allowedOrigins = [
  "https://food-front-murex.vercel.app",
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "http://localhost:5173"
];

// ✅ Le middleware CORS gère seul les requêtes OPTIONS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  preflightContinue: false, // ✅ Important : dit à CORS de répondre lui-même
  optionsSuccessStatus: 204
}));

// ❌ SUPPRIMÉ : app.options(...) car c'est elle qui fait crasher votre projet

app.use(express.json());

/* ✅ Database */
connectDB();

/* ✅ Health check */
app.get("/", (req, res) => {
  res.status(200).send("✅ API Working on Vercel");
});

/* ✅ API Routes */
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app; // INDISPENSABLE pour Vercel