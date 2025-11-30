import axiosInstance from './axiosConfig';

// Admin API endpoints
export const adminAPI = {
    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/admin/login', credentials);
        return response.data;
    },

    // Get all admins
    getAllAdmins: async () => {
        const response = await axiosInstance.get('/admin');
        return response.data;
    },

    // Create sub admin
    createSubAdmin: async (data) => {
        const response = await axiosInstance.post('/admin', data);
        return response.data;
    },

    // Reset password
    resetPassword: async (data) => {
        const response = await axiosInstance.put('/admin/reset-password', data);
        return response.data;
    },
};

// Student API endpoints
export const studentAPI = {
    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/student/login', credentials);
        return response.data;
    },

    // Get all students
    getAllStudents: async () => {
        const response = await axiosInstance.get('/student');
        return response.data;
    },

    // Create student
    createStudent: async (data) => {
        const response = await axiosInstance.post('/student', data);
        return response.data;
    },

    // Get student by ID
    getStudentById: async (id) => {
        const response = await axiosInstance.get(`/student/${id}`);
        return response.data;
    },

    // Update student
    updateStudent: async (id, data) => {
        const response = await axiosInstance.put(`/student/${id}`, data);
        return response.data;
    },

    // Delete student
    deleteStudent: async (id) => {
        const response = await axiosInstance.delete(`/student/${id}`);
        return response.data;
    },

    // Reset password
    resetPassword: async (data) => {
        const response = await axiosInstance.put('/student/reset-password', data);
        return response.data;
    },
};

// Teacher API endpoints
export const teacherAPI = {
    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/teacher/login', credentials);
        return response.data;
    },

    // Get all teachers
    getAllTeachers: async () => {
        const response = await axiosInstance.get('/teacher');
        return response.data;
    },

    // Create teacher
    createTeacher: async (data) => {
        const response = await axiosInstance.post('/teacher', data);
        return response.data;
    },

    // Get teacher by ID
    getTeacherById: async (id) => {
        const response = await axiosInstance.get(`/teacher/${id}`);
        return response.data;
    },

    // Update teacher
    updateTeacher: async (id, data) => {
        const response = await axiosInstance.put(`/teacher/${id}`, data);
        return response.data;
    },

    // Delete teacher
    deleteTeacher: async (id) => {
        const response = await axiosInstance.delete(`/teacher/${id}`);
        return response.data;
    },
};

export default {
    admin: adminAPI,
    student: studentAPI,
    teacher: teacherAPI,
};
