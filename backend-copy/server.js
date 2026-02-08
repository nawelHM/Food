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

/* ✅ CORS — VERCEL SAFE (FIX FINAL) */
const corsOptions = {
  origin: [
    "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
    "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
};

app.use(cors(corsOptions));

/* 🔥 OBLIGATOIRE POUR VERCEL */
app.options("*", cors(corsOptions));

app.use(express.json());

// DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("✅ API Working on Vercel");
});

// routes
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* 🔥 EXPORT SERVERLESS */
export default app;
