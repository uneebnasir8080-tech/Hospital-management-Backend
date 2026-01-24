import { jwtVerify } from "jose";
import { User } from "../models/user.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer token
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Access token is required" });
    }

    // decoded token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.id || decoded.userId || decoded.payload.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ status: false, message: "Invlaid token paylaod" });
    }

    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    req.userId = userId;
    req.user = checkUser;
    console.log("user", checkUser);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
