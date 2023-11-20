import { Trainers } from '@prisma/client';

import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';

import ExercisesRepository from '@src/repositories/ExercisesRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { NewExerciseType } from '@src/schemas/Exercise';

export default class ExerciseService {
  static async create(newExercise: NewExerciseType, trainer: Trainers) {
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
}
