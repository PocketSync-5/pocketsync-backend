import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// POST /api/auth/login  (public)
router.post("/login", AuthController.login);

// GET /api/auth/me  (protected — requires a valid Bearer token)
router.get("/me", requireAuth, AuthController.me);

export const authRoutes = router;
