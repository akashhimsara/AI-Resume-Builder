import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import type { LoginInput, RegisterInput } from "@/server/auth/auth.schemas";

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
  sessionVersion: number;
};

function mapUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
  sessionVersion: number;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    sessionVersion: user.sessionVersion,
  };
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new AppError("Email already in use", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const created = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      sessionVersion: true,
    },
  });

  return mapUser(created);
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      sessionVersion: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  return mapUser(user);
}

export async function getUserById(userId: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      sessionVersion: true,
    },
  });

  return user ? mapUser(user) : null;
}
