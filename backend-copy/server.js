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

/* ✅ CORS (compatible Vercel / Express 5) */
// ✅ 2. Configuration CORS
const allowedOrigins = [
  "https://food-front-murex.vercel.app", // This must match your frontend URL exactly
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "http://localhost:5173",
  "http://localhost:4000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in our list or if it's a local request (no origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // This helps you debug in Vercel logs
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

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

/* ✅ Static files */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default app;
