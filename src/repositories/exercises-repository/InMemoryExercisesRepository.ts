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
import { randomInt, randomUUID } from 'crypto';

export default class InMemoryExercisesRepository
  implements IExercisesRepository
{
  public exercises: Exercises[] = [];

  async find({
    id,
    name,
    trainer_id,
    limit,
    skip,
    startsAt,
    endsAt
  }: TFindData): Promise<TFindResponse> {
    const isStartsAtLaterThanEndsAt = startsAt && endsAt && startsAt > endsAt;

    if (isStartsAtLaterThanEndsAt) {
      throw new StartsAtLaterThanEndsAt();
    }

    const exercises = this.exercises.filter((exercise) => {
      if (!id && !name && !trainer_id && !startsAt && !endsAt) return exercise;

      if (startsAt && endsAt) {
        return exercise.created_at >= startsAt && exercise.created_at <= endsAt;
      }

      return (
        exercise.id === id ||
        exercise.name === name ||
        exercise.trainer_id === trainer_id ||
        (startsAt && exercise.created_at > startsAt) ||
        (endsAt && exercise.created_at < endsAt)
      );
    });

    return {
      exercises: exercises.slice(0, limit).slice(skip),
      total: exercises.length,
      limit: limit || 0,
      skip: skip || 0
    };
  }

  async create({
    name,
    description,
    trainer_id,
    video_url
  }: TCreateExercise): Promise<Exercises> {
    const exerciseAlreadyExists = this.exercises.find((exercise) => {
      return exercise.name === name && exercise.trainer_id === trainer_id;
    });

    if (exerciseAlreadyExists) {
      throw new ExerciseAlreadyExistsException();
    }

    const exercise: Exercises = {
      id: randomInt(10),
      name,
      description,
      trainer_id,
      video_url,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.exercises.push(exercise);

    return exercise;
  }
}
