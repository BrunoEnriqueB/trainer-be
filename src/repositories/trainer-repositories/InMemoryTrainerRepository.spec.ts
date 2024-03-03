import { beforeEach, describe, expect, it, vi } from 'vitest';
import InMemoryTrainerRepository from './InMemoryTrainerRepository';
import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';
import {
  Prisma,
  Students,
  Trainer_Students,
  Trainers,
  Users
} from '@prisma/client';
import { TrainerAlreadyExistsException } from '@src/domain/TrainerExceptions';
import { StudentAlreadyAssignedException } from '@src/domain/StudentExceptions';
import { UsersWithStudent } from './TrainerRepository';

describe('Trainer Repository find method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should find a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const trainer2: Trainers = {
      trainer_id: '2',
      user_id: '2'
    };

    inMemoryTrainerRepository.trainers.push(trainer);
    inMemoryTrainerRepository.trainers.push(trainer2);

    expect(
      inMemoryTrainerRepository.find(trainer.trainer_id)
    ).resolves.toStrictEqual(trainer);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(2);
  });

  it('should NOT find a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    expect(
      inMemoryTrainerRepository.find(trainer.trainer_id)
    ).resolves.toBeNull();
  });
});

describe('Trainer Repository exists method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should exists an trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.exists(trainer.trainer_id)
    ).resolves.toBeTruthy();
  });

  it('should NOT exists a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    expect(
      inMemoryTrainerRepository.exists(trainer.trainer_id)
    ).resolves.toBeFalsy();
  });
});

describe('Trainer Repository create method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should create a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    expect(
      inMemoryTrainerRepository.create(trainer.trainer_id)
    ).resolves.toStrictEqual(trainer);
  });

  it('should throw user is already a trainer error', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.create(trainer.trainer_id)
    ).rejects.toBeInstanceOf(TrainerAlreadyExistsException);
  });
});

describe('Trainer Repository assignStudent method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should assign a student to a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const student: Students = {
      student_id: '1',
      user_id: '2'
    };

    const trainerXStudent: Trainer_Students = {
      id: '1',
      trainer_id: trainer.trainer_id,
      student_id: student.student_id,
      created_at: new Date()
    };

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).resolves.toStrictEqual(trainerXStudent);
  });

  it('should NOT assign a student to a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const student: Students = {
      student_id: '1',
      user_id: '2'
    };

    const trainerXStudent: Trainer_Students = {
      id: '1',
      trainer_id: trainer.trainer_id,
      student_id: student.student_id,
      created_at: new Date()
    };
    prismaMock.trainer_Students.count.mockResolvedValue(1);
    prismaMock.trainer_Students.create.mockResolvedValue(trainerXStudent);

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(StudentAlreadyAssignedException);
  });
});

describe('Trainer Repository getStudents method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should bring all students from a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const student: Students = {
      student_id: '1',
      user_id: '2'
    };

    const student2: Students = {
      student_id: '2',
      user_id: '3'
    };

    const userWithStudent: StudentWithUserData = {
      userId: {
        id: student.user_id,
        document: '12345678910',
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        created_at: new Date(),
        updated_at: new Date(),
        password: 'mypassword'
      },
      ...student
    };

    const userWithStudent2: StudentWithUserData = {
      userId: {
        id: student2.user_id,
        document: '12345678911',
        email: 'johndoe2@gmail.com',
        name: 'John Doe Second',
        created_at: new Date(),
        updated_at: new Date(),
        password: 'mypassword'
      },
      ...student2
    };

    const findUsers = [userWithStudent, userWithStudent2];

    const parsedUsers = findUsers.map((user) => {
      const { userId, ...restUser } = user;
      return {
        student_id: restUser.student_id,
        ...userId
      };
    });

    prismaMock.students.findMany.mockResolvedValue(findUsers);

    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual(parsedUsers);
    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(2);
  });

  it('should bring any students from a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.students.findMany.mockResolvedValue([]);

    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual([]);
    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(0);
  });
});
