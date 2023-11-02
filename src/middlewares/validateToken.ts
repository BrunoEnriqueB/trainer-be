import { NextFunction, Request, Response } from 'express';

import Token from '@src/libs/token';

import UserService from '@src/services/UserService';

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

    const { iat, ...userData } = await Token.getUserInToken(token);

    const userExists = await UserService.userExists(userData);

    if (!userExists) {
      throw new HttpError(401, 'User does not exists');
    }
    next();
  } catch (error) {
    next(error);
  }
}
