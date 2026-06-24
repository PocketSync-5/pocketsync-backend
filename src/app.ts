import express, { Request, Response } from "express";

import { authRoutes } from "./routes/auth.routes";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware";

// Load .env into process.env (JWT_SECRET is validated inside jwt.utils.ts).
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Routes (versioned: bump /v1 → /v2 here when releasing breaking changes)
app.use("/api/v1/auth", authRoutes);

// 404 handler for unmatched routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ errors: [{ message: "Route not found" }] });
});

// Global error handler (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 PocketSync API running on http://localhost:${PORT}`);
});

export default app;