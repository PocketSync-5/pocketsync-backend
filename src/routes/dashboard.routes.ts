import { DashboardController } from "../controllers/dashboard.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All dashboard routes require a valid session token.
router.use(requireAuth);

// GET /api/v1/dashboard             → aggregated view of the logged-in user's selected accounts
// PATCH /api/v1/dashboard/selection → choose which account IDs are shown
router.get("/", DashboardController.getDashboard);
router.patch("/selection", DashboardController.setSelection);

export const dashboardRoutes = router;
