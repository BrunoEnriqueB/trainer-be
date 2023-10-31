import { NextFunction } from 'express';

import Token from '@src/libs/token';

import UserService from '@src/services/UserService';

import { HttpError } from '@src/domain/HttpErrors';

export default async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.get('authorization');

    if (!token) {
      throw new HttpError(401, 'Missing bearer token');
    }

    const userData = await Token.getUserInToken(token);

    await UserService.findUser(userData);
    next();
  } catch (error) {
    next(error);
  }
}
