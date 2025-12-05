// repositories/implementations/MongoStudentRepository.js
import IStudentRepository from '../contracts/IStudentRepository.js';
import Student from '../../models/students.model.js';
import { AppError } from '../../utils/errors.js';

class MongoStudentRepository extends IStudentRepository {
    async findStudentByEnrollmentNumber(enrollmentNumber) {
        try {
            const student = await Student.findOne({ enrollmentNumber }).select('+password');
            return student;
        } catch (error) {
            throw new AppError('Error finding student by enrollment number', 500);
        }
    }

    async findStudentById(id) {
        try {
            const student = await Student.findById(id);
            return student;
        } catch (error) {
            throw new AppError('Error finding student by ID', 500);
        }
    }

    async findStudentByEmail(email) {
        try {
            const student = await Student.findOne({ email: email.toLowerCase() });
            return student;
        } catch (error) {
            throw new AppError('Error finding student by email', 500);
        }
    }

    async findStudentByEnrollmentAndEmail(enrollmentNumber, email) {
        try {
            const student = await Student.findOne({
                enrollmentNumber,
                email: email.toLowerCase()
            });
            return student;
        } catch (error) {
            throw new AppError('Error finding student', 500);
        }
    }

    async updateStudentPassword(enrollmentNumber, newPassword) {
        try {
            const student = await Student.findOne({ enrollmentNumber });
            if (!student) {
                throw new AppError('Student not found', 404);
            }

            student.password = newPassword;
            await student.save();
            return student;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error updating password', 500);
        }
    }

    async createStudent(studentData) {
        try {
            const student = new Student(studentData);
            await student.save();
            return student;
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError('Student with this enrollment number or email already exists', 409);
            }
            throw new AppError('Error creating student', 500);
        }
    }

    async findAll(filter = {}) {
        try {
            const students = await Student.find(filter).select('-password');
            return students;
        } catch (error) {
            throw new AppError('Error fetching students', 500);
        }
    }

    async update(id, updateData) {
        try {
            const student = await Student.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            return student;
        } catch (error) {
            throw new AppError('Error updating student', 500);
        }
    }

    async delete(id) {
        try {
            const student = await Student.findByIdAndDelete(id);
            return student;
        } catch (error) {
            throw new AppError('Error deleting student', 500);
        }
    }
}

export default MongoStudentRepository;
