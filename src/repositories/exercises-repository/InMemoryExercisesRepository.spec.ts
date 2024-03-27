import { Exercises } from '@prisma/client';
import { ExerciseAlreadyExistsException } from '@src/domain/ExerciseExceptions';
import { StartsAtLaterThanEndsAt } from '@src/domain/ValidationsExceptions';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import InMemoryExercisesRepository from './InMemoryExercisesRepository';

describe('Exercises Repository find method', () => {
  let inMemoryExercisesRepository: InMemoryExercisesRepository;

  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository();
  });

  it('should find an exercise by id', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    inMemoryExercisesRepository.exercises.push(exercise);

    expect(
      inMemoryExercisesRepository.find({
        id: exercise.id
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(1);
  });

  it('should find an exercise by name', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const exercise2: Exercises = {
      id: 1,
      name: 'Supino',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    inMemoryExercisesRepository.exercises.push(exercise, exercise2);

    expect(
      inMemoryExercisesRepository.find({
        name: exercise.name
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(2);
  });

  it('should find an exercise by trainer_id', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const exercise2: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '2',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    inMemoryExercisesRepository.exercises.push(exercise, exercise2);

    expect(
      inMemoryExercisesRepository.find({
        trainer_id: exercise.trainer_id
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(2);
  });

  it('should find an exercise by startsAt', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date('2024-02-23'),
      updated_at: new Date('2024-02-23')
    };

    inMemoryExercisesRepository.exercises.push(exercise);

    expect(
      inMemoryExercisesRepository.find({
        startsAt: new Date('2024-02-22')
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(1);
  });

  it('should find an exercise by endsAt', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date('2024-02-23'),
      updated_at: new Date('2024-02-23')
    };

    inMemoryExercisesRepository.exercises.push(exercise);

    expect(
      inMemoryExercisesRepository.find({
        endsAt: new Date('2024-02-24')
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(1);
  });

  it('should find an exercise by startsAt and endsAt', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date('2024-02-23'),
      updated_at: new Date('2024-02-23')
    };

    inMemoryExercisesRepository.exercises.push(exercise);

    expect(
      inMemoryExercisesRepository.find({
        startsAt: new Date('2024-02-22'),
        endsAt: new Date('2024-02-24')
      })
    ).resolves.toStrictEqual({
      exercises: [exercise],
      limit: 0,
      skip: 0,
      total: 1
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(1);
  });

  it('should skip first exercise and return just seconds', () => {
    const exercise1: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date('2024-02-23'),
      updated_at: new Date('2024-02-23')
    };

    const exercise2: Exercises = {
      id: 2,
      name: 'Supino',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date('2024-02-23'),
      updated_at: new Date('2024-02-23')
    };

    inMemoryExercisesRepository.exercises.push(exercise1, exercise2);

    expect(
      inMemoryExercisesRepository.find({
        skip: 1
      })
    ).resolves.toStrictEqual({
      exercises: [exercise2],
      limit: 0,
      skip: 1,
      total: 2
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(2);
  });

  it('should show just the first one exercise by limiting', () => {
    const exercise1: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const exercise2: Exercises = {
      id: 2,
      name: 'Supino',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    inMemoryExercisesRepository.exercises.push(exercise1, exercise2);

    expect(
      inMemoryExercisesRepository.find({
        limit: 1
      })
    ).resolves.toStrictEqual({
      exercises: [exercise1],
      limit: 1,
      skip: 0,
      total: 2
    });
    expect(inMemoryExercisesRepository.exercises).toHaveLength(2);
  });

  it('should throw error startsAt is later than endsAt', () => {
    const startsAt = new Date();
    const endsAt = new Date();

    startsAt.setDate(startsAt.getDate() + 1);

    expect(
      inMemoryExercisesRepository.find({
        startsAt,
        endsAt
      })
    ).rejects.toBeInstanceOf(StartsAtLaterThanEndsAt);
  });
});

describe('Exercises Repository create method', () => {
  let inMemoryExercisesRepository: InMemoryExercisesRepository;

  beforeAll(() => {
    vi.mock('node:crypto', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('crypto')>()),
        randomInt: () => 1
      };
    });
    vi.useFakeTimers();
    vi.setSystemTime('2024-02-03');
  });

  afterAll(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  beforeEach(() => {
    inMemoryExercisesRepository = new InMemoryExercisesRepository();
  });

  it('should create an exercise', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(
      inMemoryExercisesRepository.create({
        name: exercise.name,
        description: exercise.description,
        trainer_id: exercise.trainer_id,
        video_url: exercise.video_url
      })
    ).resolves.toStrictEqual(exercise);
  });

  it('should create more than one exercise', () => {
    const exercise: Exercises = {
      id: 1,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const exercise2: Exercises = {
      id: 2,
      name: 'Leg press',
      description: 'Lorem Ipsum',
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(
      inMemoryExercisesRepository.create({
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
      trainer_id: '1',
      video_url: '',
      created_at: new Date(),
      updated_at: new Date()
    };

    inMemoryExercisesRepository.exercises.push(exercise);

    expect(
      inMemoryExercisesRepository.create({
        name: exercise.name,
        description: exercise.description,
        trainer_id: exercise.trainer_id,
        video_url: exercise.video_url
      })
    ).rejects.toBeInstanceOf(ExerciseAlreadyExistsException);
  });
});
