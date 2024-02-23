import { Exercises } from '@prisma/client';
import { ExerciseAlreadyExistsException } from '@src/domain/ExerciseExceptions';
import { StartsAtLaterThanEndsAt } from '@src/domain/ValidationsExceptions';
import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import PrismaExercisesRepository from './PrismaExercisesRepository';

describe('Exercises Repository find method', () => {
  const prismaExercisesRepository = new PrismaExercisesRepository();

  it('should find an exercise', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: randomUUID(),
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    prismaMock.exercises.findMany.mockResolvedValue([exercise]);

    expect(
      prismaExercisesRepository.find({
        id: 1
      })
    ).resolves.toStrictEqual([exercise]);
  });

  it('should throw error startsAt is later than endsAt', () => {
    const startsAt = new Date();
    const endsAt = new Date();

    startsAt.setDate(startsAt.getDate() + 1);

    expect(
      prismaExercisesRepository.find({
        startsAt,
        endsAt
      })
    ).rejects.toBeInstanceOf(StartsAtLaterThanEndsAt);
  });
});

describe('Exercises Repository create method', () => {
  const prismaExercisesRepository = new PrismaExercisesRepository();

  it('should create an exercise', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: randomUUID(),
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    prismaMock.exercises.create.mockResolvedValue(exercise);

    expect(
      prismaExercisesRepository.create({
        name: exercise.name,
        description: exercise.description,
        trainer_id: exercise.trainer_id,
        video_url: exercise.video_url
      })
    ).resolves.toStrictEqual(exercise);
  });

  it('should throw error exercise already exists', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: randomUUID(),
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    prismaMock.exercises.count.mockResolvedValue(1);

    expect(
      prismaExercisesRepository.create({
        name: exercise.name,
        description: exercise.description,
        trainer_id: exercise.trainer_id,
        video_url: exercise.video_url
      })
    ).rejects.toBeInstanceOf(ExerciseAlreadyExistsException);
  });
});
