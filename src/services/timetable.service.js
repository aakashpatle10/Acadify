// services/timetable.service.js
import { TimetableRepositoryImpl } from "../repositories/implementations/MongoTimetableRepository.js";
import Class from "../models/ClassSession.model.js";
import Teacher from "../models/teacher.model.js";

const timetableRepo = new TimetableRepositoryImpl();

export class TimetableService {
  static async import(jsonData) {
    let created = [];
    let skipped = [];

    for (const row of jsonData) {
      const {
        className,
        day,
        subject,
        teacherCode,
        startTime,
        endTime
      } = row;

      // STEP 1: find or create class
      let cls = await Class.findOne({ name: className });
      if (!cls) cls = await Class.create({ name: className });

      // STEP 2: find or create teacher
      let teacher = await Teacher.findOne({ teacherId: teacherCode });
      if (!teacher) {
        teacher = await Teacher.create({
          teacherId: teacherCode,
          name: teacherCode,
        });
      }

      // STEP 3: duplicate check
      const existing = await timetableRepo.findExisting(
        cls._id,
        teacher._id,
        day,
        startTime
      );

      if (existing) {
        skipped.push({ row, reason: "Slot already exists" });
        continue;
      }

      // STEP 4: create timetable entry
      const newEntry = await timetableRepo.create({
        classId: cls._id,
        teacherId: teacher._id,
        subject,
        day,
        startTime,
        endTime
      });

      created.push(newEntry);
    }

    return { created, skipped };
  }
}
