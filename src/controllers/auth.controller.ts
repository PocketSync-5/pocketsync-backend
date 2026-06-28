import { LoginInput, RegisterInput } from "../interfaces/auth.interface";
import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { BadRequestError } from "../errors/badRequest.error";

export class AuthController {
  // POST /api/v1/auth/register  { fullname, email, password }
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, email, password } = req.body ?? {};

      if (!fullname || !email || !password) {
        throw new BadRequestError("fullname, email and password are required");
      }

      const input: RegisterInput = {
        fullname: String(fullname),
        email: String(email),
        password: String(password),
      };

      const result = await AuthService.register(input);

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  // POST /api/v1/auth/login  { email, password }
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

  // GET /api/auth/me  
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      
      const currentUser = req.currentUser;

      return res.status(200).json({
        message: "Authenticated",
        user: currentUser,
      });
    } catch (err) {
      next(err);
    }
  }
}
