import { useMutation } from '@tanstack/react-query';
import { adminAPI, studentAPI, teacherAPI } from '../../../../../api/endpoints';

// Admin login hook
export const useAdminLogin = () => {
    return useMutation({
        mutationFn: (credentials) => adminAPI.login(credentials),
    });
};

// Student login hook
export const useStudentLogin = () => {
    return useMutation({
        mutationFn: (credentials) => studentAPI.login(credentials),
    });
};

// Teacher login hook
export const useTeacherLogin = () => {
    return useMutation({
        mutationFn: (credentials) => teacherAPI.login(credentials),
    });
};
