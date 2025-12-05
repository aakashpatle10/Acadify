// config/redis.js
import redis from "redis";
import config from "./environment.js";
import logger from "../utils/logger.js";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = config;

// Parse host if it contains port (format: host:port)
let redisHost = REDIS_HOST;
let redisPort = REDIS_PORT;

if (REDIS_HOST && REDIS_HOST.includes(':')) {
  const parts = REDIS_HOST.split(':');
  redisHost = parts[0];
  redisPort = parseInt(parts[1]) || REDIS_PORT;
}

const client = redis.createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: redisHost,
    port: parseInt(redisPort),
  },
});

client.on("error", (err) => {
  logger.error("Redis connection error:", err.message);
});

client.on("connect", () => {
  logger.info("✅ Redis connected successfully");
});

export async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
}

export const redisClient = client;