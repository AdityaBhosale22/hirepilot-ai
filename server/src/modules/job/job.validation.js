import { z } from "zod";

// 1. Define the base schema WITHOUT refinements
const jobBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Job title must be at least 3 characters")
    .max(100, "Job title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters"),

  location: z
    .string()
    .trim()
    .max(100)
    .optional(),

  salaryMin: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  salaryMax: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  yearsOfExperience: z.coerce
    .number()
    .int()
    .min(0)
    .optional(),

  employmentType: z.enum([
    "FULL_TIME",
    "PART_TIME",
    "INTERNSHIP",
    "CONTRACT",
  ]),

  requiredSkills: z
    .array(
      z.string().trim().min(1, "Skill cannot be empty")
    )
    .min(1, "At least one skill is required"),
});

// 2. Extract the refinement logic so we can reuse it
const salaryRefinement = (data) => {
  if (
    data.salaryMin !== undefined &&
    data.salaryMax !== undefined
  ) {
    return data.salaryMin <= data.salaryMax;
  }
  return true;
};

const salaryRefinementOptions = {
  message: "Minimum salary cannot be greater than maximum salary",
  path: ["salaryMax"],
};

// 3. Build createJobSchema (base + refinement)
export const createJobSchema = jobBaseSchema.refine(
  salaryRefinement,
  salaryRefinementOptions
);

// 4. Build updateJobSchema (base + partial + refinement)
export const updateJobSchema = jobBaseSchema
  .partial()
  .refine(salaryRefinement, salaryRefinementOptions);