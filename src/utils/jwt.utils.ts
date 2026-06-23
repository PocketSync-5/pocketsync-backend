import jwt, { Secret, SignOptions } from "jsonwebtoken";

import dotenv from "dotenv";

// Load environment variables from a `.env` file into process.env.
// Secrets must NOT be hardcoded in source — they live in `.env` (gitignored).
dotenv.config();

const JWT_EXPIRY: string = process.env.JWT_EXPIRY || "1d";

// Fail fast at startup rather than producing tokens with a weak/empty secret.
if (!process.env.JWT_SECRET) {
  throw new Error(
    "FATAL: JWT_SECRET is not set. Copy `.env.example` to `.env` and provide a value."
  );
}

// After the guard above, the secret is guaranteed to be defined.
const JWT_SECRET: Secret = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  email: string;
}

  export class JwtUtil {
    // Generate a new token when a user successfully authenticates
    static generateToken(payload: JwtPayload): string {
      // `expiresIn` expects a branded `StringValue` (ms); the env value is a
      // plain string, so we assert the shape of the options object.
      const options = { expiresIn: JWT_EXPIRY } as SignOptions;
      return jwt.sign(payload, JWT_SECRET, options);
    }

  // Verify a token coming from the mobile client's authorization headers
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}