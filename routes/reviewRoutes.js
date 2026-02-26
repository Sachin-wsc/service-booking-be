import express from "express";
import reviewController from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", authorizeRole("customer"), reviewController.createReview);
router.get("/:service_id", reviewController.getServiceReviews);

export default router;