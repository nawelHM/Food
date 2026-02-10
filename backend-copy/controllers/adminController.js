import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ===============================
   Admin Login Controller
=============================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if credentials match environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate admin JWT
      const token = jwt.sign(
        { role: "admin" }, // 👈 we mark role as admin here
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        admin: { email, role: "admin" },
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Admin login failed" });
  }
};
