import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Response } from 'express';
import type { RequestWithId } from './request-id.middleware';

/**
 * Task 3 — logs every request with its request id, e.g.
 * [3f2a...] GET /notes -> 200 (4ms)
 * Runs AFTER RequestIdMiddleware, so req.id is already set.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction) {
    const started = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - started;
      const id = (req.id ?? 'no-id').slice(0, 8);
      console.log(`[${id}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
  }
}
