import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";

export const signup = async (email: string, password: string, name?: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};
