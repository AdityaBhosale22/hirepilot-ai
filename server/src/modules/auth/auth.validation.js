import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["CANDIDATE", "RECRUITER"]),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});