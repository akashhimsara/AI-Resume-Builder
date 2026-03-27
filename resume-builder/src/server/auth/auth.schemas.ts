import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/\d/, "Password must include at least one number"),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.email().toLowerCase(),
});

const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/\d/, "Password must include at least one number");

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(40).max(256),
    password: passwordSchema,
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
