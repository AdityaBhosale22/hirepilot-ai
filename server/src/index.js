import express from "express";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import routes from "./routes/index.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HirePilot AI API is running 🚀",
  });
});

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
});