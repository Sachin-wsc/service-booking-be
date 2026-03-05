import express from "express";
import providerController from "../controllers/providerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("provider"));

// Service management
router.post("/service", providerController.createService);
router.get("/services", providerController.getProviderServices);
router.get("/service/:id", providerController.getServiceById);
router.put("/service/:id", providerController.updateService);
router.delete("/service/:id", providerController.deleteService);

// Availability management
router.post("/availability", providerController.addAvailability);
router.get("/service/:service_id/availability", providerController.getServiceAvailability);
router.get("/availability/:id", providerController.getAvailabilityById);
router.put("/availability/:id", providerController.updateAvailability);
router.patch("/availability/:id/status", providerController.toggleAvailabilityStatus);
router.delete("/availability/:id", providerController.deleteAvailability);

// Booking management
router.patch("/booking-status", providerController.updateBookingStatus);

export default router;