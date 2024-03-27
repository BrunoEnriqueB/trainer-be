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
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import InMemoryTrainerRepository, {
  UsersAndStudentsRelation
} from './InMemoryTrainerRepository';
import { UserNotFoundException } from '@src/domain/UserExceptions';
import { UsersWithStudent } from './TrainerRepository';

describe('Trainer Repository find method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should find a trainer', () => {
    const trainer1: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };
    const trainer2: Trainers = {
      trainer_id: '2',
      user_id: '2'
    };

    inMemoryTrainerRepository.trainers.push(trainer1, trainer2);

    expect(
      inMemoryTrainerRepository.find(trainer1.trainer_id)
    ).resolves.toStrictEqual(trainer1);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(2);
  });

  it('should NOT find a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(inMemoryTrainerRepository.find('2')).resolves.toBeNull();
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
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
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
  });

  it('should NOT exists a trainer', () => {
    const trainer1: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };
    const trainer2: Trainers = {
      trainer_id: '2',
      user_id: '2'
    };

    inMemoryTrainerRepository.trainers.push(trainer1, trainer2);

    expect(inMemoryTrainerRepository.exists('3')).resolves.toBeFalsy();
    expect(inMemoryTrainerRepository.trainers).toHaveLength(2);
  });
});

describe('Trainer Repository create method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeAll(() => {
    vi.mock('node:crypto', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('crypto')>()),
        randomUUID: () => '1'
      };
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    inMemoryTrainerRepository = new InMemoryTrainerRepository();
  });

  it('should create a trainer', () => {
    const user: UsersAndStudentsRelation = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      password: 'mypassword',
      email: 'johndoe@gmai.com',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null
    };

    const trainer: Trainers = {
      trainer_id: '1',
      user_id: user.id
    };

    inMemoryTrainerRepository.users.push(user);

    expect(
      inMemoryTrainerRepository.create(trainer.user_id)
    ).resolves.toStrictEqual(trainer);
    expect(inMemoryTrainerRepository.users).toHaveLength(1);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
  });

  it('should throw user is already a trainer error', () => {
    const user: UsersAndStudentsRelation = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      password: 'mypassword',
      email: 'johndoe@gmai.com',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null
    };

    const trainer: Trainers = {
      trainer_id: '1',
      user_id: user.id
    };

    inMemoryTrainerRepository.users.push(user);
    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.create(trainer.user_id)
    ).rejects.toBeInstanceOf(TrainerAlreadyExistsException);
  });

  it('should throw user being assigned does not exists', () => {
    expect(inMemoryTrainerRepository.create('1')).rejects.toBeInstanceOf(
      UserNotFoundException
    );
    expect(inMemoryTrainerRepository.users).toHaveLength(0);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(0);
  });
});

describe('Trainer Repository assignStudent method', () => {
  let inMemoryTrainerRepository: InMemoryTrainerRepository;

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime('2024-02-03');
  });

  afterAll(() => {
    vi.useRealTimers();
  });

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
    inMemoryTrainerRepository.students.push(student);

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).resolves.toStrictEqual(trainerXStudent);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
    expect(inMemoryTrainerRepository.students).toHaveLength(1);
    expect(inMemoryTrainerRepository.trainersXStudents).toHaveLength(1);
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

    inMemoryTrainerRepository.trainers.push(trainer);
    inMemoryTrainerRepository.students.push(student);
    inMemoryTrainerRepository.trainersXStudents.push(trainerXStudent);

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(StudentAlreadyAssignedException);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
    expect(inMemoryTrainerRepository.students).toHaveLength(1);
    expect(inMemoryTrainerRepository.trainersXStudents).toHaveLength(1);
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

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(StudentNotFoundException);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
    expect(inMemoryTrainerRepository.students).toHaveLength(0);
    expect(inMemoryTrainerRepository.trainersXStudents).toHaveLength(0);
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

    expect(
      inMemoryTrainerRepository.assignStudent(
        trainer.trainer_id,
        student.student_id
      )
    ).rejects.toBeInstanceOf(TrainerNotFoundException);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(0);
    expect(inMemoryTrainerRepository.students).toHaveLength(0);
    expect(inMemoryTrainerRepository.trainersXStudents).toHaveLength(0);
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

    const userWithStudent: UsersAndStudentsRelation = {
      id: student.user_id,
      document: '12345678910',
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      created_at: new Date(),
      updated_at: new Date(),
      password: 'mypassword',
      Students: {
        student_id: student.student_id,
        user_id: student.user_id,
        Trainers_Students: {
          id: '1',
          student_id: student.student_id,
          created_at: new Date(),
          trainer_id: trainer.trainer_id
        }
      }
    };

    const userWithStudent2: UsersAndStudentsRelation = {
      id: student2.user_id,
      document: '12345678911',
      email: 'johndoe2@gmail.com',
      name: 'John Doe Second',
      created_at: new Date(),
      updated_at: new Date(),
      password: 'mypassword',
      Students: {
        student_id: student2.student_id,
        user_id: student2.user_id,
        Trainers_Students: {
          id: '2',
          student_id: student2.student_id,
          created_at: new Date(),
          trainer_id: trainer.trainer_id
        }
      }
    };

    inMemoryTrainerRepository.users.push(userWithStudent, userWithStudent2);
    inMemoryTrainerRepository.trainers.push(trainer);

    const parsedUsers = [userWithStudent, userWithStudent2].map((user) => {
      const { Students, ...restUser } = user;
      return {
        student_id: Students!.student_id,
        ...restUser
      };
    });

    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual(parsedUsers);
    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(2);
    expect(inMemoryTrainerRepository.users).toHaveLength(2);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
  });

  it('should bring 0 students from a trainer', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    inMemoryTrainerRepository.trainers.push(trainer);

    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toStrictEqual([]);
    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).resolves.toHaveLength(0);
    expect(inMemoryTrainerRepository.trainers).toHaveLength(1);
    expect(inMemoryTrainerRepository.users).toHaveLength(0);
  });

  it('should throw trainer does not found', () => {
    const trainer: Trainers = {
      trainer_id: '1',
      user_id: '1'
    };

    expect(
      inMemoryTrainerRepository.getStudents(trainer.trainer_id)
    ).rejects.toBeInstanceOf(TrainerNotFoundException);
  });
});
