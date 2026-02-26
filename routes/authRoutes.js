import express from "express";
import authController from "../controllers/authController.js";
import validationService from "../services/validationService.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validationService.validateRegister,
  validationService.handleValidationErrors,
  authController.register
);

router.post(
  "/login",
  validationService.validateLogin,
  validationService.handleValidationErrors,
  authController.login
);

router.post("/logout", verifyToken, authController.logout);

export default router;