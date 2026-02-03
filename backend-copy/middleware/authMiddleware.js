import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("========== AUTH MIDDLEWARE ==========");

  console.log("HEADERS COMPLETS :", req.headers);

  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER RAW :", authHeader);

  if (!authHeader) {
    console.log("❌ Aucun header Authorization");
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("❌ Header sans 'Bearer'");
    return res.status(401).json({
      success: false,
      message: "Authorization must start with Bearer",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN EXTRAIT :", token);
  console.log("TOKEN TYPE :", typeof token);
  console.log("TOKEN LENGTH :", token?.length);
  console.log("TOKEN CONTAINS DOT :", token?.includes("."));

  console.log("JWT SECRET :", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN :", decoded);

    req.userId = decoded.id;
    req.user = decoded;

    console.log("✅ AUTH OK — userId =", decoded.id);
    console.log("====================================");

    next();
  } catch (error) {
    console.error("❌ JWT VERIFY ERROR :", error.message);
    console.log("====================================");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
