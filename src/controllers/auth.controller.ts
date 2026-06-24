import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { BadRequestError } from "../errors/badRequest.error";
import { LoginInput } from "../interfaces/auth.interface";

export class AuthController {
  // POST /api/auth/login  { email, password }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body ?? {};

      // Basic guard so missing/empty fields don't reach the service.
      if (!email || !password) {
        throw new BadRequestError("email and password are required");
      }

      const input: LoginInput = { email: String(email), password: String(password) };

      const result = await AuthService.login(input);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}