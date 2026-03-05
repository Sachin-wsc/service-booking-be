import userRepository from "../repository/userRepository.js";
import addressRepository from "../repository/addressrepository.js";
import providerRepository from "../repository/providerRepository.js";
import hashService from "../services/hashService.js";
import jwtService from "../services/jwtService.js";
import roleService from "../services/roleService.js";
import tokenBlacklistService from "../services/tokenBlacklistService.js";

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      street,
      city,
      state,
      country,
      zip,
      Buisness_name,
      description
    } = req.body;

    // Validation middleware already verified inputs
    // Check if email already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Get role ID from role name
    const roleId = await roleService.getRoleIdByName(role);
    if (!roleId) return res.status(400).json({ message: "Invalid role" });

    const hashedPassword = await hashService.hashPassword(password);

    // provider users start as pending, others active
    const initialStatus = role === "provider" ? "pending" : "active";

    const userId = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role_id: roleId,
      status: initialStatus,
      created_by: null
    });

    await addressRepository.create({
      user_id: userId,
      street,
      city,
      state,
      country,
      zip
    });

    if (role === "provider") {
      await providerRepository.create({ 
        user_id: userId, 
        Buisness_name, 
        description,
        created_by: userId
      });
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation middleware already verified email and password are present

    const user = await userRepository.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Providers must be approved before accessing
    if (user.role === 'provider') {
      if (user.status === 'pending') {
        return res.status(403).json({ message: "Waiting for admin approval" });
      }
      if (user.status === 'blocked') {
        return res.status(403).json({ message: "User is blocked" });
      }
    }

    const valid = await hashService.comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwtService.generateToken(user);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Add token to blacklist
    tokenBlacklistService.addToBlacklist(token);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { register, login, logout };