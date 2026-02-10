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

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ 1. Database Connection
// For Vercel, ensure your connectDB handles existing connections to avoid overhead
connectDB();

// ✅ 2. CORS Configuration
const allowedOrigins = [
  "https://food-front-git-main-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-eoymmfrd0-nawels-projects-e0718b0a.vercel.app",
  "https://food-front-murex.vercel.app",
  "http://localhost:5173", 
  "http://localhost:4000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed.'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. Static Files
// Note: On Vercel, /uploads might not persist. Use AWS S3 or Cloudinary for production images.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 5. API Routes
app.use("/api/foods", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ✅ 6. Health Check
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "✅ API de Food Delivery fonctionnelle",
    status: "Connecté"
  });
});

// ✅ 7. Global Error Handler (Best Practice)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ✅ 8. Server Listen
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

export default app;