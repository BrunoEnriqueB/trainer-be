import prisma from '@src/libs/client';
import { Exercises } from '@prisma/client';

import { ExercisesFilterType, NewExerciseType } from '@src/schemas/Exercise';
import { uuidType } from '@src/schemas/Generic';

import {
  ExerciseAlreadyExistsException,
  ExerciseNotFoundException
} from '@src/domain/ExerciseExceptions';
import { InternalServerError } from '@src/domain/HttpErrors';

export default class ExercisesRepository {
  static async create(
    exercise: NewExerciseType,
    trainer_id: uuidType
  ): Promise<Exercises> {
    return new Promise(async (resolve, reject) => {
      try {
        const findExercise = await prisma.exercises.findMany({
          where: { trainer_id, name: exercise.name }
        });

        if (findExercise.length) {
          return reject(new ExerciseAlreadyExistsException());
        }

        const newExercise = await prisma.exercises.create({
          data: {
            ...exercise,
            trainer_id
          }
        });

        resolve(newExercise);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async list(filters: ExercisesFilterType): Promise<Exercises[]> {
    {
      return new Promise(async (resolve, reject) => {
        try {
          const exercises = await prisma.exercises.findMany({
            where: filters
          });

          resolve(exercises);
        } catch (error) {
          return reject(new InternalServerError());
        }
      });
    }
  }

  static async getExerciseById(id: number): Promise<Exercises> {
    {
      return new Promise(async (resolve, reject) => {
        try {
          const exercise = await prisma.exercises.findUnique({
            where: { id }
          });

          if (!exercise) {
            return reject(new ExerciseNotFoundException());
          }

          resolve(exercise);
        } catch (error) {
          return reject(new InternalServerError());
        }
      });
    }
  }
}
