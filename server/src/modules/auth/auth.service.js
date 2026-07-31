import bcrypt from "bcrypt";

import ApiError from "../../utils/ApiError.js";

import authRepository from "./auth.repository.js";

import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

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

    try {
      const user = await authRepository.registerUser(
        {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role,
        },
        role
      );

      return user;
    } catch (error) {
      // Concurrent duplicate registration under the unique email constraint
      if (error?.code === "P2002") {
        throw new ApiError(409, "Email already exists");
      }
      throw error;
    }
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

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, refreshToken: __, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
