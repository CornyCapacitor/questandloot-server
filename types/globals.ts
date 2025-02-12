/* eslint-disable */
import type { Request } from 'express';

type UnusedRequestEslintDoesntWantToCooperate = Request

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}