import express from "express";
import providerController from "../controllers/providerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("provider"));

router.post("/service", providerController.createService);
router.get("/services", providerController.getProviderServices);
router.patch("/booking-status", providerController.updateBookingStatus);

export default router;