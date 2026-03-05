import express from "express";
import serviceController from "../controllers/serviceController.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();

// Public endpoints - accessible to everyone (no auth required)
router.get("/categories", adminController.getAllCategories);
router.get("/category/:id", adminController.getCategoryById);

// Service endpoints
router.get("/", serviceController.getAllServices);
router.get("/available", serviceController.getAvailableServices);
router.get("/:id", serviceController.getServiceById);
router.get("/:id/availability", serviceController.getServiceAvailability);

export default router;