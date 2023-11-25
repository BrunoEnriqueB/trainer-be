import prisma from '@src/config/client';

import { Exercises, Workouts } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';

import { uuidType } from '@src/schemas/Generic';
import { NewWorkoutType, WorkoutFiltersType } from '@src/schemas/Workout';
import { WorkoutAlreadyExistsException } from '@src/domain/WorkoutException';

export default class WorkoutRepository {
  static async create(
    workout: NewWorkoutType,
    trainer_id: uuidType
  ): Promise<Workouts> {
    return new Promise(async (resolve, reject) => {
      try {
        const findWorkout = await prisma.workouts.findUnique({
          where: { trainer_id_name: { name: workout.name, trainer_id } }
        });

        if (findWorkout) {
          return reject(new WorkoutAlreadyExistsException());
        }

        let { exercises, ...workoutData } = workout;

        const newWorkout = await prisma.workouts.create({
          data: {
            ...workoutData,
            trainer_id,
            Workout_Exercices: {
              createMany: {
                data: (exercises || []).map((exercise) => {
                  return {
                    exercise_id: exercise
                  };
                })
              }
            }
          }
        });

        resolve(newWorkout);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async list(
    filters: WorkoutFiltersType
  ): Promise<(Workouts & { exercises: Exercises[] })[]> {
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
