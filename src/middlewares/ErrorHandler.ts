import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/@types/HttpErrors';
const NODE_ENV = process.env.NODE_ENV;

export default function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.statusCode).json({
    message: err.message,
    name: err.name,
    stack: NODE_ENV !== 'production' ? err.stack : {}
  });
}
