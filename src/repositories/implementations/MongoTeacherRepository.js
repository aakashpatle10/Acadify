// repositories/implementations/MongoTeacherRepository.js
import ITeacherRepository from '../contracts/ITeacherRepository.js';
import Teacher from '../../models/teacher.model.js';
import { AppError } from '../../utils/errors.js';

class MongoTeacherRepository extends ITeacherRepository {
    async findByEmail(email) {
        try {
            const teacher = await Teacher.findOne({ email: email.toLowerCase() }).select('+password');
            return teacher;
        } catch (error) {
            throw new AppError('Error finding teacher by email', 500);
        }
    }

    async findById(id) {
        try {
            const teacher = await Teacher.findById(id);
            return teacher;
        } catch (error) {
            throw new AppError('Error finding teacher by ID', 500);
        }
    }

    async findByEmployeeId(employeeId) {
        try {
            const teacher = await Teacher.findOne({ employeeId });
            return teacher;
        } catch (error) {
            throw new AppError('Error finding teacher by Employee ID', 500);
        }
    }

    async create(teacherData) {
        try {
            const teacher = new Teacher(teacherData);
            await teacher.save();
            return teacher;
        } catch (error) {
            if (error.code === 11000) {
                if (error.keyPattern.email) {
                    throw new AppError('Teacher with this email already exists', 409);
                }
                if (error.keyPattern.employeeId) {
                    throw new AppError('Teacher with this Employee ID already exists', 409);
                }
            }
            throw new AppError('Error creating teacher', 500);
        }
    }

    async findAll(filter = {}) {
        try {
            const teachers = await Teacher.find(filter).select('-password');
            return teachers;
        } catch (error) {
            throw new AppError('Error fetching teachers', 500);
        }
    }

    async update(id, updateData) {
        try {
            const teacher = await Teacher.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            return teacher;
        } catch (error) {
            throw new AppError('Error updating teacher', 500);
        }
    }

    async delete(id) {
        try {
            const teacher = await Teacher.findByIdAndDelete(id);
            return teacher;
        } catch (error) {
            throw new AppError('Error deleting teacher', 500);
        }
    }
}

export default MongoTeacherRepository;
