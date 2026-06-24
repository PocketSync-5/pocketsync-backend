import { AuthResponse, LoginInput } from "../interfaces/auth.interface";

import { JwtUtil } from "../utils/jwt.utils";
import { UnauthorizedError } from "../errors/unauthorized.error";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../data/user.store";

export class AuthService {
  
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