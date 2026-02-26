import jwt from "jsonwebtoken";
import tokenBlacklistService from "../services/tokenBlacklistService.js";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  // Check if token is blacklisted (logged out)
  if (tokenBlacklistService.isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token has been revoked" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    req.token = token; // Store token in request for logout
    next();
  });
};

export { verifyToken };