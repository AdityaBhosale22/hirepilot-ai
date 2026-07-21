import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";

import companyRoutes from "../modules/company/company.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/companies", companyRoutes);

export default router;