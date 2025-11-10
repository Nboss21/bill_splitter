// src/modules/auth/auth.types.ts
import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: number;
}
