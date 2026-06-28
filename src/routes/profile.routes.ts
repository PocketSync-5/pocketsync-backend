import { ProfileController } from "../controllers/profile.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All profile routes require a valid session token.
router.use(requireAuth);

// GET /api/v1/profile      → get current user's profile (masked)
router.get("/", ProfileController.getProfile);

// POST /api/v1/profile     → create a new profile (first time)
router.post("/", ProfileController.createProfile);

// PATCH /api/v1/profile    → upsert: create if missing, update if exists
router.patch("/", ProfileController.updateProfile);

export const profileRoutes = router;