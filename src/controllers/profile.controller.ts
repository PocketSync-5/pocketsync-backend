import { NextFunction, Request, Response } from "express";

import { ProfileService } from "../services/profile.service";
import { UpdateProfileInput } from "../interfaces/profile.interface";

export class ProfileController {
  // GET /api/v1/profile
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.userId;
      const profile = ProfileService.getProfile(userId);
      return res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/v1/profile
  static async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.userId;
      const input: UpdateProfileInput = req.body ?? {};
      const profile = ProfileService.createProfile(userId, input);
      return res.status(201).json({ profile });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/v1/profile  (upsert — create if missing, else update)
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.userId;
      const input: UpdateProfileInput = req.body ?? {};
      const profile = ProfileService.upsertProfile(userId, input);
      return res.status(200).json({ profile });
    } catch (err) {
      next(err);
    }
  }
}