import { DashboardController } from "../controllers/dashboard.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All dashboard routes require a valid session token.
router.use(requireAuth);

// GET /api/v1/dashboard/:bvn → aggregated view of all accounts linked to the BVN
router.get("/:bvn", DashboardController.getDashboard);

export const dashboardRoutes = router;
