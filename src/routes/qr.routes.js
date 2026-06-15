
import express from "express";
import { QRController } from "../controllers/qr.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { generateQrValidator } from "../middlewares/validators/qr.validation.js";

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  requireRole("teacher"),
  generateQrValidator,
  QRController.generate     
);

export default router;
