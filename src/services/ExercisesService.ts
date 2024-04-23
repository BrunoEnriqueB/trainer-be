import { Exercises, Trainers } from '@prisma/client';
import { ExerciseAlreadyExistsException } from '@src/domain/ExerciseExceptions';

import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';

import ExercisesRepository from '@src/repositories/ExercisesRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { ExercisesFilterType, NewExerciseType } from '@src/schemas/Exercise';
import AWSServices from '@src/services/AWSServices';

export default class ExerciseService {
  static async create(
    newExercise: NewExerciseType,
    trainer: Trainers
  ): Promise<Exercises> {
    try {
      const trainerExists = await TrainerRepository.trainerExists(
        trainer.trainer_id
      );

      if (!trainerExists) {
        throw new TrainerNotFoundException();
      }

      const exercise = await ExercisesRepository.create(
        newExercise,
        trainer.trainer_id
      );

      return exercise;
    } catch (error) {
      if (error instanceof ExerciseAlreadyExistsException) {
        const awsServices = AWSServices.getInstance();

        await awsServices.deleteFile(newExercise.video_name);
      }

      throw error;
    }
  }

  static async listExercises(
    filters: ExercisesFilterType
  ): Promise<Exercises[]> {
    try {
      const exercises = await ExercisesRepository.list(filters);

      return exercises;
    } catch (error) {
      throw error;
    }
  }

  static async findExercise(id: number): Promise<Exercises> {
    try {
      const exercises = await ExercisesRepository.getExerciseById(id);

      return exercises;
    } catch (error) {
      throw error;
    }
  }
}
