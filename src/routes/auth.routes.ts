import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// POST /api/v1/auth/register 
router.post("/register", AuthController.register);

// POST /api/v1/auth/login 
router.post("/login", AuthController.login);

// GET /api/v1/auth/me  
router.get("/me", requireAuth, AuthController.me);

export const authRoutes = router;
