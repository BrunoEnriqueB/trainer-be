import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

import UserService from '@src/services/UserService';

import { HttpError } from '@src/domain/HttpErrors';

import { updateUser, user, userUniqueKeys } from '@schemas/User';
import { changePassword } from '@src/schemas/User';

export default class UserController {
  static async findUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const uniqueKeys = userUniqueKeys.parse(req.body);

      const user = await UserService.findUser(uniqueKeys);

      res.status(201).json({ success: true, user });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async createUser(
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

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userBody = updateUser.parse(req.body);

      const user = req.user!;

      await UserService.updateUser(user.id, userBody);

      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const passwords = changePassword.parse(req.body);

      const user = req.user!;

      await UserService.changePassword(
        user.id,
        passwords.actualPassword,
        passwords.newPassword
      );

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
