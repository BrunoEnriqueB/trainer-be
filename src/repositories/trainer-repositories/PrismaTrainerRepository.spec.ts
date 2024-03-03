import { Students, Trainer_Students, Trainers, Users } from '@prisma/client';
import {
  StudentAlreadyAssignedException,
  StudentNotFoundException
} from '@src/domain/StudentExceptions';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';
import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';
import { beforeEach, describe, expect, it } from 'vitest';
import PrismaTrainerRepository, {
  StudentWithUserData
} from './PrismaTrainerRepository';
import { UserNotFoundException } from '@src/domain/UserExceptions';

describe('Trainer Repository find method', () => {
  let prismaTrainerRepository: PrismaTrainerRepository;

  beforeEach(() => {
    prismaTrainerRepository = new PrismaTrainerRepository();
  });

  it('should find a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.trainers.findUnique.mockResolvedValue(trainer);

    expect(
      prismaTrainerRepository.find(trainer.trainer_id)
    ).resolves.toStrictEqual(trainer);
  });

  it('should NOT find a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.trainers.findUnique.mockResolvedValue(null);

    expect(
      prismaTrainerRepository.find(trainer.trainer_id)
    ).resolves.toBeNull();
  });
});

describe('Trainer Repository exists method', () => {
  let prismaTrainerRepository: PrismaTrainerRepository;

  beforeEach(() => {
    prismaTrainerRepository = new PrismaTrainerRepository();
  });

  it('should exists an trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.trainers.count.mockResolvedValue(1);

    expect(
      prismaTrainerRepository.exists(trainer.trainer_id)
    ).resolves.toBeTruthy();
  });

  it('should NOT exists a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.trainers.findUnique.mockResolvedValue(null);

    expect(
      prismaTrainerRepository.exists(trainer.trainer_id)
    ).resolves.toBeFalsy();
  });
});

describe('Trainer Repository create method', () => {
  let prismaTrainerRepository: PrismaTrainerRepository;

  beforeEach(() => {
    prismaTrainerRepository = new PrismaTrainerRepository();
  });

  it('should create a trainer', () => {
    const user: Users = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      password: 'mypassword',
      email: 'johndoe@gmai.com',
      created_at: new Date(),
      updated_at: new Date()
    };

    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.users.findUnique.mockResolvedValue(user);
    prismaMock.trainers.findUnique.mockResolvedValue(null);
    prismaMock.trainers.create.mockResolvedValue(trainer);

    expect(
      prismaTrainerRepository.create(trainer.trainer_id)
    ).resolves.toStrictEqual(trainer);
  });

  it('should throw user is already a trainer error', () => {
    const user: Users = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      password: 'mypassword',
      email: 'johndoe@gmai.com',
      created_at: new Date(),
      updated_at: new Date()
    };

    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.users.findUnique.mockResolvedValue(user);
    prismaMock.trainers.findUnique.mockResolvedValue(trainer);

    expect(
      prismaTrainerRepository.create(trainer.trainer_id)
    ).rejects.toBeInstanceOf(TrainerAlreadyExistsException);
  });

  it('should throw user being assigned does not exists', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.users.findUnique.mockResolvedValue(null);
    prismaMock.users.findUnique.mockResolvedValue(null);

    expect(
      prismaTrainerRepository.create(trainer.trainer_id)
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});

describe('Trainer Repository assignStudent method', () => {
  let prismaTrainerRepository: PrismaTrainerRepository;

  beforeEach(() => {
    prismaTrainerRepository = new PrismaTrainerRepository();
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

    prismaMock.trainers.findUnique.mockResolvedValue(trainer);
    prismaMock.students.findUnique.mockResolvedValue(student);
    prismaMock.trainer_Students.count.mockResolvedValue(0);
    prismaMock.trainer_Students.create.mockResolvedValue(trainerXStudent);

    expect(
      prismaTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).resolves.toStrictEqual(trainerXStudent);
  });

  it('should throw student already assign', () => {
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

    prismaMock.trainers.findUnique.mockResolvedValue(trainer);
    prismaMock.students.findUnique.mockResolvedValue(student);
    prismaMock.trainer_Students.count.mockResolvedValue(1);
    prismaMock.trainer_Students.create.mockResolvedValue(trainerXStudent);

    expect(
      prismaTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(StudentAlreadyAssignedException);
  });

  it('should throw student beign assigned does not found', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const student: Students = {
      student_id: '1',
      user_id: '2'
    };

    prismaMock.trainers.findUnique.mockResolvedValue(trainer);
    prismaMock.students.findUnique.mockResolvedValue(null);
    prismaMock.trainer_Students.count.mockResolvedValue(0);

    expect(
      prismaTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(StudentNotFoundException);
  });

  it('should throw trainer beign assigned does not found', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    const student: Students = {
      student_id: '1',
      user_id: '2'
    };

    prismaMock.trainers.findUnique.mockResolvedValue(null);
    prismaMock.students.findUnique.mockResolvedValue(student);
    prismaMock.trainer_Students.count.mockResolvedValue(0);

    expect(
      prismaTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(TrainerNotFoundException);
  });
});

describe('Trainer Repository getStudents method', () => {
  let prismaTrainerRepository: PrismaTrainerRepository;

  beforeEach(() => {
    prismaTrainerRepository = new PrismaTrainerRepository();
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
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual(parsedUsers);
    expect(
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(2);
  });

  it('should bring 0 students from a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.students.findMany.mockResolvedValue([]);

    expect(
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual([]);
    expect(
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(0);
  });

  it('should throw trainer does not found', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    prismaMock.students.findMany.mockResolvedValue([]);

    expect(
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual([]);
    expect(
      prismaTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(0);
  });
});
