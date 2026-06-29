import { NextFunction, Request, Response } from "express";

import { DashboardService } from "../services/dashboard.service";
import { SelectionService } from "../services/selection.service";

export class DashboardController {
  // GET /api/v1/dashboard → aggregated view of the logged-in user's selected accounts
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.userId;
      const dashboard = DashboardService.getDashboard(userId);
      return res.status(200).json({ dashboard });
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/v1/dashboard/selection → choose which account IDs are shown
  static async setSelection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.currentUser!.userId;
      const result = SelectionService.setSelection(userId, req.body ?? {});
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
