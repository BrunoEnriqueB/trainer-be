import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UserAlreadyExistsException,
  UserWithSameCredentials
} from '@src/domain/UserExceptions';
import { prisma as prismaMock } from '@src/libs/__mocks__/prisma';
import {
  TCreateUser,
  TUpdateUser
} from '@src/repositories/user-repositories/UserRepository';
import PrismaUserRepository from './PrismaUserRepository';
import { TUsers } from './UserRepository';

describe('User Repository create method', () => {
  const prismaUserRepository = new PrismaUserRepository();
  it('should create a new user', async () => {
    const newUser: TCreateUser = {
      document: '1234',
      email: 'johndoe@gmail.com',
      password: 'johndoe10',
      name: 'John Doe'
    };

    const actualDate = new Date();

    prismaMock.users.findMany.mockResolvedValue([]);

    prismaMock.users.create.mockResolvedValue({
      id: '1',
      ...newUser,
      created_at: actualDate,
      updated_at: actualDate
    });

    const user = prismaUserRepository.create(newUser);
    expect(user).resolves.toStrictEqual({
      id: '1',
      ...newUser,
      created_at: actualDate,
      updated_at: actualDate
    });
  });

  it('should throw exception user already exists', async () => {
    const newUser: TCreateUser = {
      document: '1234',
      email: 'johndoe@gmail.com',
      password: 'johndoe10',
      name: 'John Doe'
    };

    const actualDate = new Date();

    prismaMock.users.findMany.mockResolvedValue([
      {
        id: '1',
        ...newUser,
        created_at: actualDate,
        updated_at: actualDate
      }
    ]);

    const user = prismaUserRepository.create(newUser);
    expect(user).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});

describe('User Repository find method', () => {
  const prismaUserRepository = new PrismaUserRepository();
  it('should return a user', () => {
    const newUser: TUsers = {
      id: randomUUID(),
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    prismaMock.users.findUnique.mockResolvedValue(newUser);

    const user = prismaUserRepository.find({ document: newUser.document });

    expect(user).resolves.toStrictEqual(newUser);
  });

  it('should not return a user', () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    const user = prismaUserRepository.find({ document: '12345678911' });

    expect(user).resolves.toBeNull();
  });
});

describe('User Repository exists method', () => {
  const prismaUserRepository = new PrismaUserRepository();
  it('should return true because found a user', () => {
    const newUser: TUsers = {
      id: randomUUID(),
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    prismaMock.users.findFirst.mockResolvedValue(null);

    const user = prismaUserRepository.exists({ document: newUser.document });

    expect(user).resolves.toBeTruthy();
  });

  it('should return false because not found user', () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    const user = prismaUserRepository.exists({ document: '12345678911' });

    expect(user).resolves.toBeFalsy();
  });
});

describe('User Repository update method', () => {
  const prismaUserRepository = new PrismaUserRepository();
  it('should throw error user with same credentials', () => {
    const id = randomUUID();
    const newUserData: TUpdateUser = {
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com'
    };

    prismaMock.users.update.mockRejectedValue(
      new PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: ''
      })
    );

    expect(prismaUserRepository.update(id, newUserData)).rejects.toThrow(
      UserWithSameCredentials
    );
  });
});

describe('User Repository update password method', () => {
  const prismaUserRepository = new PrismaUserRepository();
  it('should throw error user with same credentials', () => {
    const id = randomUUID();
    const newPassword = 'myNewPassword';

    expect(
      prismaUserRepository.updatePassword(id, newPassword)
    ).resolves.toBeUndefined();
  });
});
