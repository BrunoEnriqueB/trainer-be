import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { HttpError } from '@src/domain/HttpErrors';

import {
  createWorkoutBody,
  findWorkoutByIdParams,
  updateWorkoutExercisesBody,
  updateWorkoutStudentsBody,
  workoutFilters
} from '@src/schemas/Workout';
import AWSServices from '@src/services/AWSServices';
import WorkoutsService from '@src/services/WorkoutsService';

export default class WorkoutsController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workout = createWorkoutBody.parse({ ...req.body, logo: req.file });
      const AwsServices = new AWSServices();

      const uploadImage = await AwsServices.uploadFile(workout.logo);
      const trainer = req.trainer!;

      const workoutCreated = await WorkoutsService.create(trainer.trainer_id, {
        name: workout.name,
        description: workout.description,
        logo_url: uploadImage.Location,
        video_name: uploadImage.Key
      });

      res.status(201).json({ success: true, id: workoutCreated.id });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = workoutFilters.parse(req.query);

      const workouts = await WorkoutsService.list(filters);

      res.status(200).json({ success: true, workouts });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = findWorkoutByIdParams.parse(req.params);

      const workout = await WorkoutsService.findById(id);

      res.status(200).json({ success: true, workout });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async updateStudents(req: Request, res: Response, next: NextFunction) {
    const trainer = req.trainer!;
    const updateWorkoutStudents = updateWorkoutStudentsBody.safeParse(req.body);

    if (!updateWorkoutStudents.success) {
      throw new HttpError(
        403,
        updateWorkoutStudents.error.name,
        updateWorkoutStudents.error.issues
      );
    }

    const { workout_id, add, remove } = updateWorkoutStudents.data;
    try {
      if (add.length) {
        await WorkoutsService.assignStudents(
          trainer.trainer_id,
          workout_id,
          add
        );
      }

      if (remove.length) {
        await WorkoutsService.unassignStudents(
          trainer.trainer_id,
          workout_id,
          remove
        );
      }

      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;

        throw new HttpError(403, zodError.name, zodError.issues);
      }
      next(error);
    }
  }

  static async updateExercises(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const trainer = req.trainer!;
    let updateWorkoutExercises = updateWorkoutExercisesBody.safeParse(req.body);

    if (!updateWorkoutExercises.success) {
      throw new HttpError(
        403,
        updateWorkoutExercises.error.name,
        updateWorkoutExercises.error.issues
      );
    }

    const { add, remove, workout_id } = updateWorkoutExercises.data;

    try {
      await WorkoutsService.updateAssignedExercises({
        trainer_id: trainer.trainer_id,
        workout_id,
        add,
        remove
      });
      res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  }
}
