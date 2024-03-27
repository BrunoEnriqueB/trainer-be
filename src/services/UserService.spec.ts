import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { UserNotFoundException } from '@src/domain/UserExceptions';
import {
  TCreateUser,
  TUsers
} from '@src/repositories/user-repositories/UserRepository';

import { makeUserService } from '@src/tests/utils/makeServices';
import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

describe('User Service find method', () => {
  it('should find an user by id', () => {
    const { inMemoryUserRepository, userService } = makeUserService();

    const user: TUsers = {
      id: '1',
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user);

    const { password, ...publicUser } = user;

    expect(
      userService.find({
        id: user.id
      })
    ).resolves.toStrictEqual(publicUser);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should find an user by email', () => {
    const { inMemoryUserRepository, userService } = makeUserService();

    const user: TUsers = {
      id: '1',
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user);

    const { password, ...publicUser } = user;

    expect(
      userService.find({
        email: user.email
      })
    ).resolves.toStrictEqual(publicUser);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should find an user by document', () => {
    const { inMemoryUserRepository, userService } = makeUserService();

    const user: TUsers = {
      id: '1',
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user);

    const { password, ...publicUser } = user;

    expect(
      userService.find({
        document: user.document
      })
    ).resolves.toStrictEqual(publicUser);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should NOT find an user', () => {
    const { inMemoryUserRepository, userService } = makeUserService();

    const user: TUsers = {
      id: '1',
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user);

    expect(
      userService.find({
        id: user.id + '1'
      })
    ).rejects.toBeInstanceOf(UserNotFoundException);
  });
});

describe('User Service create method', () => {
  beforeAll(() => {
    vi.mock('@src/utils/hashPassword', async (importOriginal) => {
      return {
        ...(await importOriginal<typeof import('crypto')>()),
        hashPassword: vi.fn((password: string) => password)
      };
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should create a user', async () => {
    const { userService, inMemoryUserRepository } = makeUserService();

    const createUser: TCreateUser = {
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword'
    };

    expect(hashPassword).toBeCalledTimes(0);
    expect(inMemoryUserRepository.users).toHaveLength(0);
    expect(await userService.create(createUser)).toBeUndefined();
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(hashPassword).toBeCalledTimes(1);
  });
});

describe('User Service update method', () => {
  beforeAll(() => {
    vi.mock('@src/utils/hashPassword', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@src/utils/hashPassword')
      >();
      return {
        ...mod,
        hashPassword: vi.fn((password: string) => password),
        verifyPassword: vi.fn((data: string, encrypted: string) => true)
      };
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should update an user password', async () => {
    const { inMemoryUserRepository, userService } = makeUserService();
    const user: TUsers = {
      id: '1',
      email: 'johndoe@gmail.com',
      document: '12345678910',
      name: 'John Doe',
      password: 'mypassword',
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };
    const spy = vi.spyOn(inMemoryUserRepository, 'updatePassword');

    expect(inMemoryUserRepository.users).toHaveLength(0);
    expect(spy).toHaveBeenCalledTimes(0);

    inMemoryUserRepository.users.push(user);

    expect(verifyPassword).toHaveBeenCalledTimes(0);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(
      await userService.updatePassword(user.id, user.password, 'newPassword')
    ).toBeUndefined();
    expect(verifyPassword).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
