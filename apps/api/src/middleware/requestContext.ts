import { randomUUID } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

export interface RequestContext {
  userId?: string;
  communityId?: string;
  role?: string;
  correlationId: string;
}

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}

export function requestContext(req: Request, res: Response, next: NextFunction): void {
  const headerCorrelationId = req.headers['x-correlation-id'];
  const correlationId =
    typeof headerCorrelationId === 'string' && headerCorrelationId.length > 0
      ? headerCorrelationId
      : randomUUID();

  req.context = {
    correlationId
  };

  res.setHeader('x-correlation-id', correlationId);
  next();
}
