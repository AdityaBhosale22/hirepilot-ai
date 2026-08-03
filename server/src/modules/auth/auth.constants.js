import { isProduction } from "../../config/env.js";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const REFRESH_TOKEN_COOKIE_PATH = "/api/v1/auth";

export const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: REFRESH_TOKEN_COOKIE_PATH,
  maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
};
