declare namespace Express {
  export interface Request {
    rateLimit?: {
      limit: number;
      current: number;
      remaining: number;
    };
  }
}

export interface GenerateImageRequest extends Express.Request {
  body: {
    model?: string;
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    format?: "jpeg" | "png";
  };
}
