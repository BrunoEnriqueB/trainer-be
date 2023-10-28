import { HttpError } from '@src/domain/HttpErrors';
import { NextFunction, Request, Response } from 'express';

const NODE_ENV = process.env.NODE_ENV;

export default function <T>(
  err: HttpError<T>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors,
    name: err.name,
    stack: NODE_ENV !== 'production' ? err.stack : {}
  });
}
