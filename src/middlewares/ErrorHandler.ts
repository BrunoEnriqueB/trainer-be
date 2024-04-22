import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@src/domain/HttpErrors';

const NODE_ENV = process.env.NODE_ENV;

export default function <T>(
  err: HttpError<T>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
    name: err.name,
    stack: NODE_ENV !== 'production' ? err.stack : {}
  });
}
