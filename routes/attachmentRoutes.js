import express from "express";
import multer from "multer";
import attachmentController from "../controllers/attachmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.use(verifyToken);

router.post(
  "/upload",
  upload.single("image"),
  attachmentController.uploadProof
);

router.get("/:booking_id", attachmentController.getBookingAttachments);

export default router;