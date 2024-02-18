import { ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

import { UserService } from '@src/services/UserService';

import { HttpError, UnauthorizedError } from '@src/domain/HttpErrors';

import { updateUser, user } from '@schemas/User';
import { changePassword } from '@src/schemas/User';
import { email, userId } from '@src/schemas/Generic';

export default class UserController {
  constructor(private userService: UserService) {}

  async findUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const emailData = email.parse(req.params.email);

      const user = await this.userService.find({ email: emailData });

      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  async findUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = userId.parse(req.params.id);

      const user = await this.userService.find({ id });

      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userEmail = email.parse(req.params.email);
      const userBody = updateUser.parse(req.body);

      const user = req.user!;

      if (user.email !== userEmail) {
        throw new UnauthorizedError();
      }

      await this.userService.update(user.id, userBody);

      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userEmail = email.parse(req.params.email);
      const passwords = changePassword.parse(req.body);

      const user = req.user!;

      if (user.email !== userEmail) {
        throw new UnauthorizedError();
      }

      await this.userService.updatePassword(
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
