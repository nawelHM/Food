import mongoose from "mongoose";
import 'dotenv/config'; // ensure env variables are loaded

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI; // read from .env
    if (!mongoUri) {
      throw new Error("MONGO_URI not set in environment");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
