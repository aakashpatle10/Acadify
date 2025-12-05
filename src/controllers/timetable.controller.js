// controllers/timetable.controller.js
import { TimetableService } from "../services/timetable.service.js";
import { importTimetableValidator as timetableImportSchema } from "../middlewares/validators/timetable.validation.js";

export class TimetableController {
  static async importTimetable(req, res) {
    try {
      const data = req.body;

      // validation
      const { error } = timetableImportSchema.validate(data);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const result = await TimetableService.import(data);

      return res.status(201).json({
        message: "Timetable imported successfully",
        createdCount: result.created.length,
        skippedCount: result.skipped.length,
        skipped: result.skipped
      });

    } catch (err) {
      console.error("Timetable import error:", err);
      res.status(500).json({ error: err.message });
    }
  }
}
