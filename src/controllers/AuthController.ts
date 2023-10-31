import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@src/domain/HttpErrors';

import { user, userSign } from '@schemas/User';

import AuthService from '@src/services/AuthService';
import UserService from '@src/services/UserService';

export default class AuthController {
  static async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userBody = user.parse(req.body);

      await UserService.createUser(userBody);

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async signIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sign = userSign.parse(req.body);

      const token = await AuthService.authUser(sign);

      res.status(200).json({ success: true, token });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
