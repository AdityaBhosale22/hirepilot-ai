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