import express from "express";
import adminController from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRole("admin"));

router.post("/approve-provider", adminController.approveProvider);
router.post("/category", adminController.addCategory);
router.get("/users", adminController.getAllUsers);
router.patch("/block-user", adminController.blockUser);

export default router;