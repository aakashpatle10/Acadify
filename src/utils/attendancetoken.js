// utils/attendancetoken.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET; // same secret login + QR ke liye
const DEFAULT_EXPIRES = "10s"; // default 10 seconds

if (!SECRET) {
  // optional: warn in dev
  console.warn("JWT_SECRET is not defined. Please set it in your .env");
}

export function signAttendanceToken(payload, expiresIn = DEFAULT_EXPIRES) {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyAttendanceToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}
