import { AuthResponse, LoginInput, RegisterInput } from "../interfaces/auth.interface";
import { createUser, findUserByEmail } from "../data/user.store";

import { ConflictError } from "../errors/conflict.error";
import { JwtUtil } from "../utils/jwt.utils";
import { UnauthorizedError } from "../errors/unauthorized.error";
import bcrypt from "bcryptjs";

export class AuthService {
  /**
   * Register a new user.
   * - Checks for duplicate emails (case-insensitive).
   * - Hashes the password via bcrypt (inside createUser).
   * - Issues a JWT so the user is logged in immediately after signup.
   */
  static async register({ fullname, email, password }: RegisterInput): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    // Reject if a user with this email already exists.
    const existing = findUserByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError("Email is already in use");
    }

    const user = createUser({
      fullname,
      email: normalizedEmail,
      password,
    });

    const token = JwtUtil.generateToken({ userId: user.id, email: user.email });

    return {
      token,
      user: { id: user.id, email: user.email, fullname: user.fullname },
    };
  }

  static async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = findUserByEmail(normalizedEmail);

    const passwordValid = user
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, "$2b$10$invalidHashToWasteTimeXXXXXXXXXXXXXXXXXXXXXXX");

    if (!user || !passwordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = JwtUtil.generateToken({ userId: user.id, email: user.email });

    // Never return the password hash — only safe, public fields.
    return {
      token,
      user: { id: user.id, email: user.email, fullname: user.fullname },
    };
  }
}