// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const REDIS_URL = process.env.REDIS_URL!;

