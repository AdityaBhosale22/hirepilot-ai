import bcrypt from "bcrypt";

import ApiError from "../../utils/ApiError.js";

import authRepository from "./auth.repository.js";

import { generateAccessToken } from "../../utils/jwt.js";
import { generateRefreshToken } from "../../utils/jwt.js";

class AuthService {
  async register(data) {
    const { fullName, email, password, role } = data;

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.registerUser(
      {
        fullName,
        email,
        password: hashedPassword,
        role,
      },
      role
    );

    return user;
  }
  async login(data) {
    const { email, password } = data;

    // Find user
    const user = await authRepository.findUserWithPassword(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const payload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    // Save refresh token
    await authRepository.updateRefreshToken(
      user.id,
      refreshToken
    );

    // Remove password before returning
    const { password: _, refreshToken: __, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();