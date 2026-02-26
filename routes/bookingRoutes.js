import express from "express";
import bookingController from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("customer"));

router.post("/", bookingController.createBooking);
router.get("/my-bookings", bookingController.getUserBookings);

export default router;