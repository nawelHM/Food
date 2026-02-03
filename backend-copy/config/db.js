import mongoose from "mongoose";
import 'dotenv/config'; // load environment variables

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // ✅ Mongoose 7+ doesn't need useNewUrlParser or useUnifiedTopology
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
