import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/** Extra field carried on the request so the logger can print it. */
export type RequestWithId = Request & { id?: string };

/**
 * Task 3 — gives every request a unique id (crypto randomUUID),
 * stores it on the request object and sends it back in the
 * `X-Request-Id` response header.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction) {
    const id = randomUUID();
    req.id = id;
    res.setHeader('X-Request-Id', id);
    next();
  }
}
