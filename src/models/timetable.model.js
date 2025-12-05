// models/timetable.model.js
import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "ClassSession" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: String,
    day: String,
    startTime: String,
    endTime: String,
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);