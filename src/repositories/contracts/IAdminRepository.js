// repositories/contracts/IAdminRepository.js
class IAdminRepository {
    async findAdminByEmail(email) {
        throw new Error('Method not implemented');
    }

    async findAdminById(id) {
        throw new Error('Method not implemented');
    }

    async updateAdminPassword(email, newPassword) {
        throw new Error('Method not implemented');
    }

    async createAdmin(adminData) {
        throw new Error('Method not implemented');
    }

    async findAllSubAdmins() {
        throw new Error('Method not implemented');
    }

    async updateSubAdmin(id, updateData) {
        throw new Error('Method not implemented');
    }

    async deleteSubAdmin(id) {
        throw new Error('Method not implemented');
    }
}

export default IAdminRepository;
