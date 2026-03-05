import express from "express";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", serviceController.getAllServices);
router.get("/available", serviceController.getAvailableServices);
router.get("/:id", serviceController.getServiceById);
router.get("/:id/availability", serviceController.getServiceAvailability);
 
export default router;
 