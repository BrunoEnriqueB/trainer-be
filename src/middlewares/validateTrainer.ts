import { NextFunction, Request, Response } from 'express';

import Token from '@src/libs/token';

import { HttpError } from '@src/domain/HttpErrors';
import AuthService from '@src/services/AuthService';

export default async function validateTrainer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new HttpError(401, 'Missing bearer token');
    }

    const token = authorization.split(' ')[1];

    const { iat, id } = await Token.getUserInToken(token);

    const trainer = await AuthService.validateTrainer(id);

    req.trainer = trainer;
    next();
  } catch (error) {
    next(error);
  }
}
