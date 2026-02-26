import jwt from "jsonwebtoken";

const generateToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, role_id: user.role_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  } catch {
    throw new Error("JWT failed");
  }
};

export default { generateToken };