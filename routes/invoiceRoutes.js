import express from "express";
import invoiceController from "../controllers/invoiceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.patch("/pay", invoiceController.markInvoicePaid);
router.get("/:booking_id", invoiceController.getInvoice);

export default router;