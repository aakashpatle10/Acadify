# Acadify Backend

Backend service for **Acadify**, a role-based academic management system designed for students, teachers, and administrators.

This service handles authentication, authorization, and core business logic for the Acadify web application.

---

## 🚀 Live API

https://acadify-backend-553k.onrender.com

**Base URL**
https://acadify-backend-553k.onrender.com/api



---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Redis**
- **JWT Authentication**
- **Mongoose ODM**
- **Tanstack Query**
- **Axios / REST APIs**

---

## ✨ Features

- Student, Teacher, and Admin authentication
- Role‑based access control
- Secure JWT authentication with refresh tokens
- Redis used for refresh token management
- MongoDB Atlas for persistent data storage
- CORS configured for production frontend (Vercel)
- Clean architecture (controllers, services, repositories)

> ⚠️ Some features are currently implemented with mock or placeholder data and will be extended with full production logic.

---

## 📂 Project Structure

src/
│
├── controllers/ # Request handlers
├── services/ # Business logic
├── repositories/ # Database operations
├── models/ # Mongoose schemas
├── routes/ # API routes
├── middlewares/ # Auth, validators
├── utils/ # Helpers (JWT, logger, errors)
├── config/ # DB, Redis, env configs
└── app.js # App entry point


---

## 🔐 Authentication Flow

- Access Token → short lived (JWT)
- Refresh Token → stored in Redis
- Tokens sent securely using HTTP‑only cookies

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
ALLOWED_ORIGINS=http://localhost:3000,https://acadify-frontend.vercel.app
NODE_ENV=production
```

---

## 📦 Installation

```bash
npm install
```

---

## 🚀 Running the App

```bash
npm run dev
```

---

## 📝 License

This project is for educational and learning purposes.

## 👨‍💻 Author

**Aakash Kumar Patle**  
Acadify – Smart Academic Management System
