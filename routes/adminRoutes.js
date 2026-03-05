import express from "express";
import adminController from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("admin"));

// Provider management
router.post("/approve-provider", adminController.approveProvider);
router.get("/providers", adminController.getAllProviders);

// User management
router.get("/users", adminController.getAllUsers);
router.post("/block-user", adminController.blockUser);

// Category management
router.post("/category", adminController.addCategory);
router.get("/categories", adminController.getAllCategories);
router.get("/category/:id", adminController.getCategoryById);
router.put("/category/:id", adminController.updateCategory);
router.delete("/category/:id", adminController.deleteCategory);

export default router;
