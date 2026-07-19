import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  website: z
    .string()
    .trim()
    .url("Invalid website URL")
    .optional(),

  logo: z
    .string()
    .trim()
    .url("Invalid logo URL")
    .optional(),

  industry: z
    .string()
    .trim()
    .max(100)
    .optional(),

  size: z
    .string()
    .trim()
    .max(50)
    .optional(),

  location: z
    .string()
    .trim()
    .max(100)
    .optional(),
});