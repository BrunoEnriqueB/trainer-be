import { Exercises, Trainers } from '@prisma/client';

import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';

import ExercisesRepository from '@src/repositories/ExercisesRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { ExercisesFilterType, NewExerciseType } from '@src/schemas/Exercise';

export default class ExerciseService {
  static async create(
    newExercise: NewExerciseType,
    trainer: Trainers
  ): Promise<void> {
    try {
      const trainerExists = await TrainerRepository.trainerExists(
        trainer.trainer_id
      );

      if (!trainerExists) {
        throw new TrainerNotFoundException();
      }

      await ExercisesRepository.create(newExercise, trainer.trainer_id);
    } catch (error) {
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
}
