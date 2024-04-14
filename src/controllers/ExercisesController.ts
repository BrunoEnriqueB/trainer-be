import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@src/domain/HttpErrors';

import { exerciseBody, exercisesFilters } from '@src/schemas/Exercise';
import { id } from '@src/schemas/Generic';
import AWSServices from '@src/services/AWSServices';
import ExerciseService from '@src/services/ExercisesService';

export default class ExercisesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const exercise = exerciseBody.parse({ ...req.body, video: req.file });
    try {
      const AwsServices = new AWSServices();

      const uploadImage = await AwsServices.uploadFile(exercise.video);
      const trainer = req.trainer!;

      await ExerciseService.create(
        {
          name: exercise.name,
          description: exercise.description,
          video_url: uploadImage.Location,
          video_name: uploadImage.Key
        },
        trainer
      );

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async listExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = exercisesFilters.parse(req.query);

      const exercises = await ExerciseService.listExercises(filters);

      res.status(200).json({ success: true, exercises });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async findExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const exerciseId = id.parse(req.params.id);

      const exercise = await ExerciseService.findExercise(exerciseId);

      res.status(200).json({ success: true, exercise });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }
}
