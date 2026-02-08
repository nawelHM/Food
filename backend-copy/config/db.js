import mongoose from "mongoose";
import "dotenv/config"; // load environment variables

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ MONGO_URI is not defined in environment variables");
      return;
    }

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // ❌ DO NOT exit the process on Vercel
  }
};
