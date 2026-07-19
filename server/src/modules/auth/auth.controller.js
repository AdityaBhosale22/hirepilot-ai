import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import authService from "./auth.service.js";

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      user
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.login(req.body);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "Login successful", {
        user,
        accessToken,
      })
    );
});

export { register, login };