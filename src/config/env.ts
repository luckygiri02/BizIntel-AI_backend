import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1),

  FRONTEND_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);