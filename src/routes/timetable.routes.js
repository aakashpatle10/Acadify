// routes/timetable.routes.js
import express from "express";
import { TimetableController } from "../controllers/timetable.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { importTimetableValidator } from "../middlewares/validators/timetable.validation.js";

const router = express.Router();

// POST /api/timetable/import-json
router.post(
  "/import-json",
  importTimetableValidator,
  TimetableController.importTimetable
);

export default router;
