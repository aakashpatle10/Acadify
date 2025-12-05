// repositories/implementations/MongoTimetableRepository.js
import Timetable from "../../models/timetable.model.js";
import { ITimetableRepository } from "../contracts/ITimetableRepository.js";

export class TimetableRepositoryImpl extends ITimetableRepository {
  async findExisting(classId, teacherId, day, startTime) {
    return await Timetable.findOne({
      classId,
      teacherId,
      day,
      startTime
    });
  }

  async create(data) {
    return await Timetable.create(data);
  }

  async bulkInsert(list) {
    return await Timetable.insertMany(list);
  }
}
