// repositories/contracts/IStudentRepository.js
class IStudentRepository {
    async findStudentByEnrollmentNumber(enrollmentNumber) {
        throw new Error('Method not implemented');
    }

    async findStudentById(id) {
        throw new Error('Method not implemented');
    }

    async findStudentByEmail(email) {
        throw new Error('Method not implemented');
    }

    async findStudentByEnrollmentAndEmail(enrollmentNumber, email) {
        throw new Error('Method not implemented');
    }

    async updateStudentPassword(enrollmentNumber, newPassword) {
        throw new Error('Method not implemented');
    }

    async createStudent(studentData) {
        throw new Error('Method not implemented');
    }

    async findAll(filter) {
        throw new Error('Method not implemented');
    }

    async update(id, updateData) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }
}

export default IStudentRepository;
