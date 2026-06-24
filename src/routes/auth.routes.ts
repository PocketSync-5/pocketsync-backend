import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

// POST /api/auth/login
router.post("/login", AuthController.login);

export const authRoutes = router;