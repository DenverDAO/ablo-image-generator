import { Router } from 'express';
import { generateImage, registerImage, prepareMetadata, verifyMint } from '../controllers/image.controller';
import { validateGenerateRequest, validateRegisterRequest, validatePrepareMetadataRequest, validateVerifyMintRequest } from '../middlewares/validation.middleware';
import { rateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

router.get("/health-check", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.post('/generate', rateLimiter, validateGenerateRequest, generateImage);
router.post('/register', validateRegisterRequest, registerImage);
router.post('/prepare-metadata', validatePrepareMetadataRequest, prepareMetadata);
router.post('/verify-mint', validateVerifyMintRequest, verifyMint);

export default router;
