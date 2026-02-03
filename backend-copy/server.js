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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://food-front-murex.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // 🔥 IMPORTANT: reply to preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// DB (important : une seule fois)
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

// static uploads (⚠️ lecture seule sur Vercel)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ❌ PAS DE app.listen
export default app;
