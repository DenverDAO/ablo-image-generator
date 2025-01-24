import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/response';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  res.status(500).json(
    formatResponse(null, err.message || 'Internal server error')
  );
}
