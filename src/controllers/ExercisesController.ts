import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@src/domain/HttpErrors';

import { exerciseBody } from '@src/schemas/Exercise';
import AWSServices from '@src/services/AWSServices';
import ExerciseService from '@src/services/ExercisesService';

export default class ExercisesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = exerciseBody.parse({ ...req.body, video: req.file });

      const AwsServices = new AWSServices();

      const uploadImage = await AwsServices.uploadImage(exercise.video);
      const trainer = req.trainer!;

      await ExerciseService.create(
        {
          name: exercise.name,
          description: exercise.description,
          video_url: uploadImage.Location
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
}
