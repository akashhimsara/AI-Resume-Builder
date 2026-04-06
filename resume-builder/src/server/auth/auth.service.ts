import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { env } from "@/lib/env";
import { sendResetPasswordEmail } from "@/lib/mailer";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/server/auth/auth.schemas";

const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

type PasswordResetTokenOps = {
  create: (args: unknown) => Promise<unknown>;
  findUnique: (args: unknown) => Promise<unknown>;
  updateMany: (args: unknown) => Promise<{ count: number }>;
  deleteMany: (args: unknown) => Promise<unknown>;
};

function getPasswordResetTokenOps(client: unknown): PasswordResetTokenOps {
  return (client as { passwordResetToken: PasswordResetTokenOps }).passwordResetToken;
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export type PublicUser = {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
  sessionVersion: number;
  stripeCustomerId?: string | null;
};

function mapUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN";
  sessionVersion: number;
  stripeCustomerId?: string | null;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    sessionVersion: user.sessionVersion,
    stripeCustomerId: user.stripeCustomerId ?? null,
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
      stripeCustomerId: true,
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
    console.log("User not found for email:", input.email);
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    console.log("Password mismatch for user:", user.email);
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  console.log("Login success for user:", user.email);
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
      stripeCustomerId: true,
    },
  });

  return user ? mapUser(user) : null;
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      email: true,
    },
  });

  // Keep response identical even when the email does not exist.
  if (!user) {
    return;
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);

  await getPasswordResetTokenOps(prisma).create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;
  try {
    await sendResetPasswordEmail({
      to: user.email,
      resetUrl,
    });
  } catch (error) {
    if (env.NODE_ENV !== "production") {
      console.warn("Password reset email sending failed in development:", error);
      console.info(`Password reset link (dev fallback): ${resetUrl}`);
      return;
    }

    throw new AppError("Unable to send password reset email", 500, "EMAIL_SEND_FAILED");
  }

  if (env.NODE_ENV !== "production") {
    console.info(`Password reset link (dev): ${resetUrl}`);
  }
}

export async function validatePasswordResetToken(rawToken: string): Promise<boolean> {
  const tokenHash = hashResetToken(rawToken);
  const token = (await getPasswordResetTokenOps(prisma).findUnique({
    where: { tokenHash },
    select: {
      id: true,
      expiresAt: true,
      consumedAt: true,
    },
  })) as { id: string; expiresAt: Date; consumedAt: Date | null } | null;

  if (!token) {
    return false;
  }

  if (token.consumedAt) {
    return false;
  }

  if (token.expiresAt <= new Date()) {
    return false;
  }

  return true;
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const tokenHash = hashResetToken(input.token);
  const now = new Date();
  const passwordHash = await bcrypt.hash(input.password, 12);

  await prisma.$transaction(async (tx) => {
    const token = (await getPasswordResetTokenOps(tx).findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        consumedAt: true,
      },
    })) as { id: string; userId: string; expiresAt: Date; consumedAt: Date | null } | null;

    if (!token || token.consumedAt || token.expiresAt <= now) {
      throw new AppError("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
    }

    const consumed = await getPasswordResetTokenOps(tx).updateMany({
      where: {
        id: token.id,
        consumedAt: null,
      },
      data: {
        consumedAt: now,
      },
    });

    if (consumed.count !== 1) {
      throw new AppError("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
    }

    await tx.user.update({
      where: { id: token.userId },
      data: {
        passwordHash,
        sessionVersion: {
          increment: 1,
        },
      },
    });

    await getPasswordResetTokenOps(tx).deleteMany({
      where: {
        userId: token.userId,
        consumedAt: null,
      },
    });
  });
}
