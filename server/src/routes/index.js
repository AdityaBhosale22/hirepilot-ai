import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import companyRoutes from "../modules/company/company.routes.js";
import jobRoutes from "../modules/job/job.routes.js";
import applicationRoutes from "../modules/application/application.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/resumes", resumeRoutes);

export default router;