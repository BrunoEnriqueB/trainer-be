import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AuthService } from '@src/services/AuthService';
import { UserService } from '@src/services/UserService';

import { HttpError } from '@src/domain/HttpErrors';

import { user, userSign, userUniqueKeysPartial } from '@schemas/User';

export default class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userBody = user.parse(req.body);

      await this.userService.create(userBody);

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sign = userSign.parse(req.body);

      const token = await this.authService.authUser(sign);

      res.status(200).json({ success: true, token });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  async recoveryPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = userUniqueKeysPartial.parse(req.body);

      await this.authService.recoveryUserPassword(userData);

      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
