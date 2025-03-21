import express from "express";
import { generateImage, registerImage } from "../controllers/image.controller";
import { validateGenerateRequest, validateRegisterRequest } from "../middlewares/validation.middleware";
import { rateLimiter } from "../middlewares/rateLimit.middleware";

const router = express.Router();

router.get("/health-check", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.post("/generate", rateLimiter, validateGenerateRequest, generateImage);
router.post("/register", validateRegisterRequest, registerImage);

export default router;
