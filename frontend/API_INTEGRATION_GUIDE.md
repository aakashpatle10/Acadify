# API Integration Setup - Complete Guide

## 📁 Folder Structure Created

```
frontend/src/
├── api/
│   ├── axiosConfig.js          # Axios instance with interceptors
│   └── endpoints.js             # All API endpoints (admin, student, teacher)
├── hooks/                       # Global hooks (if needed)
├── store/
│   ├── authSlice.js            # Redux auth state management
│   └── index.js                # Redux store configuration
├── types/
│   └── index.js                # TypeScript-like constants (roles, statuses)
└── app/auth/login/
    └── hooks/
        ├── api/
        │   └── useLogin.js      # React Query login mutations
        └── personal/
            └── useLoginForm.js  # Form handling logic
```

## 🔧 Technologies Used

1. **Axios** - HTTP client for API calls
2. **@tanstack/react-query** - Data fetching and caching
3. **@reduxjs/toolkit** - State management
4. **react-redux** - Redux bindings for React

## 🔐 Authentication Flow

### Login Process:
1. User selects role (Student/Teacher/Admin)
2. Enters credentials:
   - **Student**: Enrollment Number + Password
   - **Teacher/Admin**: Email + Password
3. Form submits to appropriate API endpoint
4. On success:
   - Token and user data saved to Redux store
   - Data persisted in localStorage
   - User redirected to role-specific dashboard:
     - Admin → `/admin`
     - Student → `/student`
     - Teacher → `/teacher`

## 📡 API Endpoints

### Admin APIs
- `POST /api/admin/login` - Login
- `GET /api/admin` - Get all admins
- `POST /api/admin` - Create sub admin
- `PUT /api/admin/reset-password` - Reset password

### Student APIs
- `POST /api/student/login` - Login
- `GET /api/student` - Get all students
- `POST /api/student` - Create student
- `GET /api/student/:id` - Get student by ID
- `PUT /api/student/:id` - Update student
- `DELETE /api/student/:id` - Delete student
- `PUT /api/student/reset-password` - Reset password

### Teacher APIs
- `POST /api/teacher/login` - Login
- `GET /api/teacher` - Get all teachers
- `POST /api/teacher` - Create teacher
- `GET /api/teacher/:id` - Get teacher by ID
- `PUT /api/teacher/:id` - Update teacher
- `DELETE /api/teacher/:id` - Delete teacher

## 🔑 Test Credentials

### Admin (Main Admin)
```
Email: dean@college.com
Password: Admin@123
```

### Sub Admin (HOD)
```
Email: hod.cs@college.com
Password: HOD@123
```

### Student
```
Enrollment: CS2023001
Password: Student@123
```

### Teacher
```
Email: (Create via admin panel)
Password: (Set during creation)
```

## 🚀 How to Use

### 1. Start Backend
```bash
cd backend
npm start
# Backend runs on http://localhost:9000
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Login
1. Open browser: `http://localhost:5173`
2. Select your role
3. Enter credentials
4. Click "Secure Login"

## 📝 Code Examples

### Using Login Hook in Components
```javascript
import { useLoginForm } from './hooks/personal/useLoginForm';

const MyComponent = () => {
  const {
    formData,
    selectedRole,
    error,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  );
};
```

### Making API Calls
```javascript
import { adminAPI, studentAPI, teacherAPI } from '@/api/endpoints';

// Admin login
const response = await adminAPI.login({ email, password });

// Get all students
const students = await studentAPI.getAllStudents();

// Create teacher
const newTeacher = await teacherAPI.createTeacher(teacherData);
```

### Using Redux State
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/authSlice';

const MyComponent = () => {
  const { user, token, isAuthenticated, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Login
  dispatch(setCredentials({ user, token }));

  // Logout
  dispatch(logout());
};
```

## 🔒 Security Features

1. **JWT Tokens** - Stored in localStorage and sent with every request
2. **Axios Interceptors** - Automatically add token to requests
3. **401 Handling** - Auto logout on unauthorized access
4. **CORS** - Properly configured for frontend-backend communication
5. **Password Encryption** - Handled by backend (bcrypt)

## 🎯 Next Steps

To add more pages with API integration:

1. **Create hooks folder** in the page directory:
   ```
   src/app/[module]/[page]/hooks/
   ├── api/          # React Query hooks
   └── personal/     # Form/logic hooks
   ```

2. **Create API hook** (api/useYourApi.js):
   ```javascript
   import { useQuery, useMutation } from '@tanstack/react-query';
   import { yourAPI } from '@/api/endpoints';

   export const useGetData = () => {
     return useQuery({
       queryKey: ['dataKey'],
       queryFn: () => yourAPI.getData(),
     });
   };
   ```

3. **Create personal hook** (personal/useYourLogic.js):
   ```javascript
   import { useState } from 'react';
   import { useGetData } from '../api/useYourApi';

   export const useYourLogic = () => {
     const { data, isLoading } = useGetData();
     // Your logic here
     return { data, isLoading };
   };
   ```

4. **Use in component**:
   ```javascript
   import { useYourLogic } from './hooks/personal/useYourLogic';

   const YourComponent = () => {
     const { data, isLoading } = useYourLogic();
     // Render your component
   };
   ```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend is running on port 9000
- Check `VITE_API_URL` in `.env` file
- Verify CORS is enabled in backend

### Login Not Working
- Check network tab for API errors
- Verify credentials are correct
- Check backend logs for errors
- Ensure MongoDB is running

### Token Issues
- Clear localStorage: `localStorage.clear()`
- Check if token is being sent in headers
- Verify token format in backend

## 📚 Resources

- [Axios Documentation](https://axios-http.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
