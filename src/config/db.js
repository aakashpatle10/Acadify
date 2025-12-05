// config/db.js
import mongoose from "mongoose";
import config from "./environment.js";
const { MONGODB_URI } = config;
import logger from "../utils/logger.js";

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
