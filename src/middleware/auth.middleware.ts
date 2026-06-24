import { JwtPayload, JwtUtil } from "../utils/jwt.utils";
import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../errors/unauthorized.error";

// Extend Express Request interface to hold our user details globally.
declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  // 1. Check if Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authentication token required"));
  }

  // 2. Extract token string
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using our utility
    const payload = JwtUtil.verifyToken(token);

    // 4. Attach payload to request object for use in protected controllers
    req.currentUser = payload;

    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired session token"));
  }
};