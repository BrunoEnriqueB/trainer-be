import { Exercises } from '@prisma/client';
import { ExerciseAlreadyExistsException } from '@src/domain/ExerciseExceptions';
import { StartsAtLaterThanEndsAt } from '@src/domain/ValidationsExceptions';
import { prisma } from '@src/libs/client';
import {
  IExercisesRepository,
  TCreateExercise,
  TFindData,
  TFindResponse
} from './ExercisesRepository';

export default class PrismaExercisesRepository implements IExercisesRepository {
  find({
    id,
    name,
    trainer_id,
    limit,
    skip,
    startsAt,
    endsAt
  }: TFindData): Promise<TFindResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const isStartsAtLaterThanEndsAt =
          startsAt && endsAt && startsAt > endsAt;

        if (isStartsAtLaterThanEndsAt) {
          return reject(new StartsAtLaterThanEndsAt());
        }

        const [exercises, total] = await prisma.$transaction([
          prisma.exercises.findMany({
            where: {
              id,
              name: {
                contains: name,
                mode: 'insensitive'
              },
              trainer_id,
              created_at: {
                gte: startsAt,
                lte: endsAt
              }
            },
            skip,
            take: limit
          }),
          prisma.exercises.count({
            where: {
              id,
              name,
              trainer_id,
              created_at: {
                gte: startsAt,
                lte: endsAt
              }
            }
          })
        ]);

        return resolve({
          exercises,
          total,
          skip: skip || 0,
          limit: limit || 0
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  create({
    name,
    description,
    trainer_id,
    video_url
  }: TCreateExercise): Promise<Exercises> {
    return new Promise(async (resolve, reject) => {
      try {
        const exerciseAlreadyExists = await prisma.exercises.count({
          where: {
            name,
            trainer_id
          }
        });

        if (exerciseAlreadyExists) {
          return reject(new ExerciseAlreadyExistsException());
        }

        const exercise = await prisma.exercises.create({
          data: {
            name,
            description,
            trainer_id,
            video_url
          }
        });

        return resolve(exercise);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
