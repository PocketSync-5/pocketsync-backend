import { NextFunction, Request, Response } from "express";

import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  // GET /api/v1/dashboard/:bvn → aggregated accounts for the given BVN
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      // req.params.bvn is typed as string | string[] in Express 5; a single
      // "/:bvn" segment is always a string at runtime, so coerce it safely.
      const bvn = String(req.params.bvn);
      const dashboard = DashboardService.getDashboard(bvn);
      return res.status(200).json({ dashboard });
    } catch (err) {
      next(err);
    }
  }
}
