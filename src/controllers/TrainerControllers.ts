import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError, UnauthorizedError } from '@src/domain/HttpErrors';

import { UserUniqueKeysType, userUniqueKeysPartial } from '@src/schemas/User';
import TrainerService from '@src/services/TrainerService';
export default class TrainerController {
  static async createTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user!;
      const trainerData = userUniqueKeysPartial.parse(req.body);

      const userUniqueKeys = trainerData as UserUniqueKeysType;

      if (
        (userUniqueKeys.document &&
          userUniqueKeys.document !== user.document) ||
        (userUniqueKeys.email && userUniqueKeys.email !== user.email)
      ) {
        throw new UnauthorizedError();
      }

      await TrainerService.insertTrainer(trainerData);

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async assignStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentData = userUniqueKeysPartial.parse(req.body);

      const trainer = req.trainer!;

      await TrainerService.assignStudent(trainer, studentData);

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
