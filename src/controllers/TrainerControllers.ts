import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@src/domain/HttpErrors';

import { userUniqueKeys } from '@src/schemas/User';
import TrainerService from '@src/services/TrainerService';

export default class TrainerController {
  static async createTrainer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerData = userUniqueKeys.parse(req.body);

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
      const studentData = userUniqueKeys.parse(req.body);

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
