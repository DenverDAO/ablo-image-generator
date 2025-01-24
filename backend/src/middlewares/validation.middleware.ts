import { Request, Response, NextFunction } from 'express';
import { ImageGenerationOptions } from '../types';

export function validateImageRequest(req: Request, res: Response, next: NextFunction) {
  const { prompt, width, height, format } = req.body;
  
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid or missing prompt' });
  }

  if (![256, 512, 768].includes(Number(width))) {
    return res.status(400).json({ success: false, error: 'Width must be 256, 512, or 768' });
  }

  if (![256, 512, 768].includes(Number(height))) {
    return res.status(400).json({ success: false, error: 'Height must be 256, 512, or 768' });
  }

  if (!['jpeg', 'png'].includes(format)) {
    return res.status(400).json({ success: false, error: 'Invalid format' });
  }

  next();
}
