import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
  },
  { timestamps: true }
);

// Vérifie si le modèle existe déjà, sinon crée-le
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
