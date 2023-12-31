import { NextFunction, Request, Response } from 'express';

import Token from '@src/libs/token';

import AuthService from '@src/services/AuthService';

import { HttpError } from '@src/domain/HttpErrors';

export default async function validateUser(
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

    const user = await AuthService.validateUser(id);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
