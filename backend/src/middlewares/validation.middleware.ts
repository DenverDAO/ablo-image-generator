import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { GenerateImageRequest } from "../types/requests";

export const validateGenerateRequest = [
  body("prompt")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Prompt must be between 1 and 500 characters"),
  body("negativePrompt")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Negative prompt must not exceed 500 characters"),
  body("width")
    .optional()
    .isInt({ min: 256, max: 1024 })
    .withMessage("Width must be between 256 and 1024"),
  body("height")
    .optional()
    .isInt({ min: 256, max: 1024 })
    .withMessage("Height must be between 256 and 1024"),
  body("format")
    .optional()
    .isIn(["jpeg", "png"])
    .withMessage("Format must be either 'jpeg' or 'png'"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateRegisterRequest = [
  body("imageData")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image data is required"),
  body("prompt")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Prompt must be between 1 and 500 characters"),
  body("model")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Model name is required"),
  body("format")
    .optional()
    .isIn(["jpeg", "png"])
    .withMessage("Format must be either 'jpeg' or 'png'"),
  body("creator")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Creator identifier is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validatePrepareMetadataRequest = [
  body("imageUrl")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Image URL or base64 data is required"),
  body("prompt")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Prompt must be between 1 and 500 characters"),
  body("style")
    .optional()
    .isString()
    .trim()
    .withMessage("Style must be a string"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateVerifyMintRequest = [
  body("txHash")
    .isString()
    .trim()
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage("Transaction hash must be a valid Ethereum transaction hash"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
