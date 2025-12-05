// repositories/implementations/MongoAdminRepository.js
import IAdminRepository from '../contracts/IAdminRepository.js';
import Admin from '../../models/admin.model.js';
import { AppError } from '../../utils/errors.js';

class MongoAdminRepository extends IAdminRepository {
    async findAdminByEmail(email) {
        try {
            const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
            return admin;
        } catch (error) {
            throw new AppError('Error finding admin by email', 500);
        }
    }

    async findAdminById(id) {
        try {
            const admin = await Admin.findById(id);
            return admin;
        } catch (error) {
            throw new AppError('Error finding admin by ID', 500);
        }
    }

    async updateAdminPassword(email, newPassword) {
        try {
            const admin = await Admin.findOne({ email: email.toLowerCase() });
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            admin.password = newPassword;
            await admin.save();
            return admin;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error updating password', 500);
        }
    }

    async createAdmin(adminData) {
        try {
            const admin = new Admin(adminData);
            await admin.save();
            return admin;
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError('Admin with this email already exists', 409);
            }
            throw new AppError('Error creating admin', 500);
        }
    }

    async findAllSubAdmins() {
        try {
            const subAdmins = await Admin.find({ role: 'sub_admin' }).select('-password');
            return subAdmins;
        } catch (error) {
            throw new AppError('Error fetching sub-admins', 500);
        }
    }

    async updateSubAdmin(id, updateData) {
        try {
            const admin = await Admin.findOneAndUpdate(
                { _id: id, role: 'sub_admin' },
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            return admin;
        } catch (error) {
            throw new AppError('Error updating sub-admin', 500);
        }
    }

    async deleteSubAdmin(id) {
        try {
            const admin = await Admin.findOneAndDelete({ _id: id, role: 'sub_admin' });
            return admin;
        } catch (error) {
            throw new AppError('Error deleting sub-admin', 500);
        }
    }
}

export default MongoAdminRepository;
