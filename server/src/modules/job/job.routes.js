import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
  createJobSchema,
  updateJobSchema,
} from "./job.validation.js";

import {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  updateJobStatus,
} from "./job.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("RECRUITER"),
  validate(createJobSchema),
  createJob
);

router.get(
  "/me",
  authenticate,
  authorize("RECRUITER"),
  getMyJobs
);

router.get("/:id", getJobById);

router.patch(
  "/:id",
  authenticate,
  authorize("RECRUITER"),
  validate(updateJobSchema),
  updateJob
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("RECRUITER"),
  updateJobStatus
);

export default router;