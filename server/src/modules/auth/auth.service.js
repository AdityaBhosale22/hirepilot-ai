import bcrypt from "bcrypt";

import ApiError from "../../utils/ApiError.js";

import authRepository from "./auth.repository.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
} from "../../utils/jwt.js";

import {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from "../../utils/authTokens.js";

import { REFRESH_TOKEN_COOKIE_MAX_AGE_MS } from "./auth.constants.js";

class AuthService {
  async register(data) {
    const { fullName, email, password, role } = data;

    // Normalize email to prevent duplicate accounts differing only by case
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    try {
      user = await authRepository.registerUser(
        {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role,
        },
        role
      );
    } catch (error) {
      // Concurrent duplicate registration under the unique email constraint
      if (error?.code === "P2002") {
        throw new ApiError(409, "Email already exists");
      }
      throw error;
    }

    const verificationToken = generateEmailVerificationToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: this.sanitizeUser(user),
      verificationToken,
    };
  }

  async login(data) {
    const { email, password } = data;

    // Normalize email the same way as registration
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findUserWithPassword(normalizedEmail);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    const REQUIRE_EMAIL_VERIFICATION =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
    }

    const { accessToken, refreshToken } = await this.issueTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await authRepository.findUserByIdWithAuth(payload.userId);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const REQUIRE_EMAIL_VERIFICATION =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
    }

    if (!user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Compare the hash of the presented token with the stored hash.
    // A mismatched hash means the token was already rotated (replay).
    const tokenHash = hashRefreshToken(refreshToken);

    if (tokenHash !== user.refreshTokenHash) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshTokenExpiresAt < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    // Rotate: issue a fresh pair and replace the stored hash atomically
    const tokens = await this.issueTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout({ userId, refreshToken } = {}) {
    if (userId) {
      await authRepository.clearRefreshToken(userId);
      return;
    }

    if (!refreshToken) {
      return;
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      await authRepository.clearRefreshToken(payload.userId);
    } catch {
      // Best-effort cleanup; the cookie will still be cleared by the controller.
    }
  }

  async changePassword(userId, data) {
    const { currentPassword, newPassword } = data;

    const user = await authRepository.findUserByIdWithAuth(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Invalidate refresh token so the user must log in again
    await authRepository.updatePassword(userId, hashedPassword);
  }

  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(400, "Verification token is required");
    }

    let payload;

    try {
      payload = verifyEmailVerificationToken(token);
    } catch {
      throw new ApiError(400, "Invalid or expired verification token");
    }

    const user = await authRepository.findUserByIdWithAuth(payload.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      await authRepository.markEmailVerified(user.id);
    }

    const verifiedUser = await authRepository.findUserById(user.id);

    return {
      user: verifiedUser,
    };
  }

  async resendVerification(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (!user) {
      return { message: "If the account exists, a verification link has been generated." };
    }

    if (user.isEmailVerified) {
      return {
        message: "This account is already verified.",
        alreadyVerified: true,
        user: this.sanitizeUser(user),
      };
    }

    const verificationToken = generateEmailVerificationToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "Verification link generated successfully.",
      verificationToken,
      user: this.sanitizeUser(user),
    };
  }

  async forgotPassword(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findUserByEmail(normalizedEmail);

    if (!user) {
      return { message: "If the account exists, a reset link has been generated." };
    }

    const resetToken = generatePasswordResetToken({
      userId: user.id,
      email: user.email,
    });

    return {
      message: "Password reset link generated successfully.",
      resetToken,
      user: this.sanitizeUser(user),
    };
  }

  async resetPassword(token, data) {
    if (!token) {
      throw new ApiError(400, "Reset token is required");
    }

    let payload;

    try {
      payload = verifyPasswordResetToken(token);
    } catch {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const user = await authRepository.findUserByIdWithAuth(payload.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await authRepository.updatePassword(user.id, hashedPassword);

    return {
      user: this.sanitizeUser(user),
    };
  }

  async issueTokens(user) {
    const REQUIRE_EMAIL_VERIFICATION =
      process.env.REQUIRE_EMAIL_VERIFICATION === "true";

    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenExpiresAt = new Date(
      Date.now() + REFRESH_TOKEN_COOKIE_MAX_AGE_MS
    );

    await authRepository.updateRefreshToken(
      user.id,
      hashRefreshToken(refreshToken),
      refreshTokenExpiresAt
    );

    return { accessToken, refreshToken };
  }

  sanitizeUser(user) {
    const { password, refreshTokenHash, refreshTokenExpiresAt, ...safeUser } =
      user;

    return safeUser;
  }
}

export default new AuthService();
