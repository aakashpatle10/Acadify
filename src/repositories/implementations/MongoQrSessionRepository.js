// repositories/implementations/MongoQrSessionRepository.js
import QRSession from "../../models/Qrsession.model.js";
import { IQRSessionRepository } from "../contracts/IQrSessionRepository.js";

export class QRSessionRepositoryImpl extends IQRSessionRepository {
  async create(data) {
    return await QRSession.create(data);
  }

  async findActiveByToken(token) { 
    return await QRSession.findOne({ token, active: true });
  }

  async deactivateById(id) {
    return await QRSession.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );
  }
}