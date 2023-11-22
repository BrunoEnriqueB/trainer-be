import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError, UnauthorizedError } from '@src/domain/HttpErrors';

import TrainerService from '@src/services/TrainerService';

import { userId } from '@src/schemas/Generic';
import { trainerId, trainerUniqueKeys } from '@src/schemas/Trainer';
import { UserUniqueKeysType, userUniqueKeysPartial } from '@src/schemas/User';

export default class TrainerController {
  static async findTrainerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = userId.parse(req.params.id);

      const trainer = await TrainerService.getTrainer({ id });

      res.status(200).json({ success: true, trainer });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async findTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const trainerKeys = trainerUniqueKeys.parse(req.query);

      const trainer = await TrainerService.getTrainer(trainerKeys);

      res.status(200).json({ success: true, trainer });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

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

  static async getTrainerStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const trainer_id = trainerId.parse(req.params.trainerId);

      const students = await TrainerService.getStudents(trainer_id);

      res.status(200).json({ success: true, students });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
