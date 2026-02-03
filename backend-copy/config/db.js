import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nawelksinfo_db_user:CF4fzhJKWXqAs95z@cluster0.ydq1z96.mongodb.net/food_delivery"
    );
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
