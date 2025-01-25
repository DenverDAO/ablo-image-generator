import { Router } from "express";
import { generateImage } from "../controllers/image.controller";
import { validateGenerateRequest } from "../middlewares/validation.middleware";
import { rateLimiter } from "../middlewares/rateLimit.middleware";

export const router = Router();

router.get("/health-check", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.post("/generate", rateLimiter, validateGenerateRequest, generateImage);
