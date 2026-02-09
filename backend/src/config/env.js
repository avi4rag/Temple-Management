import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/divya-setu"),
  JWT_SECRET: z.string().default("dev-jwt-secret-min-32-chars-length-required"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string().default("dev-refresh-token-secret-min-32-chars"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:8080,http://localhost:5173"),
});

export const env = envSchema.parse(process.env);
