import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 2, // Hugging Face API rate limit is 3 requests per minute, so we set ours to 2 to be safe
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests, please try again later",
});
