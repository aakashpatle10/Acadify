// controllers/Qr.controller.js
import {QRService} from "../services/qr.service.js";
import { AppError } from "../utils/errors.js";

export class QRController {
  static async generate(req, res, next) {
    try {
      console.log("REQ BODY ===>", req.body);
      const { timetableId, expiresInSeconds } = req.body;
      const userId = req.user?.id; 

      if (!userId) {
        return next(new AppError("Unauthorized", 401));
      }

      const result = await QRService.generateForTimetable({
        timetableId,
        teacherUserId: userId,
        expiresInSeconds,
      });

      return res.status(201).json({
        message: "QR generated successfully",
        sessionId: result.sessionId,
        qrDataUri: result.qrDataUri,
        expiresAt: result.expiresAt,
      });
    } catch (err) {
      next(err);
    }
  }
}
