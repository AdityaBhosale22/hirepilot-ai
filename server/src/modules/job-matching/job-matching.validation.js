/**
 * @file job-matching.validation.js
 */
import { z } from "zod";

const cuidSchema = z.string().cuid("Invalid ID format.");

export const analyzeJobMatchSchema = z.object({
  params: z.object({
    jobId: cuidSchema,
  }),
  body: z.object({
    resumeId: cuidSchema,
  }),
});

export const getJobMatchReportSchema = z.object({
  params: z.object({
    jobId: cuidSchema,
  }),
  query: z.object({
    resumeId: cuidSchema,
  }),
});

export const deleteJobMatchSchema = z.object({
  params: z.object({
    matchId: cuidSchema,
  }),
});
