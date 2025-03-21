declare namespace Express {
  export interface Request {
    rateLimit?: {
      limit: number;
      current: number;
      remaining: number;
    };
  }
}

import { Request } from "express";

export interface GenerateImageRequest extends Request {
  body: {
    model?: string;
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    format?: string;
  };
}

export interface RegisterImageRequest extends Request {
  body: {
    imageData: string; // base64 encoded image data
    prompt: string;
    model: string;
    format?: string;
    creator: string; // wallet address or username
  };
}
