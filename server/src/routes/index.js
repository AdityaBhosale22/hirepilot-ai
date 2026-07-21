import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";

import companyRoutes from "../modules/company/company.routes.js";

import jobRoutes from "../modules/job/job.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/companies", companyRoutes);

router.use("/jobs", jobRoutes);

export default router;