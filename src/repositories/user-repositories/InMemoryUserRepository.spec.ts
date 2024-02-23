import { beforeEach, describe, expect, it } from 'vitest';

import {
  UserAlreadyExistsException,
  UserWithSameCredentials
} from '@src/domain/UserExceptions';
import {
  TCreateUser,
  TUpdateUser,
  TUsers
} from '@src/repositories/user-repositories/UserRepository';
import { randomUUID } from 'node:crypto';
import InMemoryUserRepository from './InMemoryUserRepository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Users } from '@prisma/client';

describe('User Repository create method', () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  it('should create a new user', async () => {
    const newUser: TCreateUser = {
      document: '1234',
      email: 'johndoe@gmail.com',
      password: 'johndoe10',
      name: 'John Doe'
    };

    const user = inMemoryUserRepository.create(newUser);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(user).resolves.toStrictEqual(inMemoryUserRepository.users[0]);
    expect(await user).equal(newUser.document);
  });

  it('should throw exception user already exists', () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const newUser: TCreateUser = {
      document: '1234',
      email: 'johndoe@gmail.com',
      password: 'johndoe10',
      name: 'John Doe'
    };

    inMemoryUserRepository.create(newUser);
    const user = inMemoryUserRepository.create({
      document: '1234',
      email: 'johndoe@gmail.com',
      password: 'johndoe10',
      name: 'John Doe 2'
    });
    expect(user).rejects.toBeInstanceOf(UserAlreadyExistsException);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(inMemoryUserRepository.users[0].name).equal(newUser.name);
  });
});

describe('User Repository find method', () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  it('should return an user that has equals document and email', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.find({
      email: newUser.email,
      document: newUser.document
    });

    expect(user).resolves.toStrictEqual(newUser);
    expect(user).resolves.toStrictEqual(inMemoryUserRepository.users[0]);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should return not return an user that has different emails', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.find({
      email: 'johndoe@hotmail.com',
      document: newUser.document
    });

    expect(user).resolves.toBeNull();
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(inMemoryUserRepository.users[0]).toStrictEqual(newUser);
  });

  it('should return not return an user that has different document', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.find({
      email: newUser.email,
      document: '98765432111'
    });

    expect(user).resolves.toBeNull();
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(inMemoryUserRepository.users[0]).toStrictEqual(newUser);
  });

  it('should return an user that has equals only document equals', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.find({
      document: newUser.document
    });

    expect(user).resolves.toStrictEqual(newUser);
    expect(user).resolves.toStrictEqual(inMemoryUserRepository.users[0]);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should return an user that has equals only email equals', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.find({
      document: newUser.document
    });

    expect(user).resolves.toStrictEqual(newUser);
    expect(user).resolves.toStrictEqual(inMemoryUserRepository.users[0]);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should not return a user', () => {
    const user = inMemoryUserRepository.find({
      document: '12345678911'
    });

    expect(user).toBeNull();
  });
});

describe('User Repository exists method', () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  it('should return true because found a user by document', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.exists({
      document: newUser.document
    });

    expect(user).resolves.toBeTruthy();
  });

  it('should return true because found a user by email', () => {
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

    inMemoryUserRepository.users.push(newUser);

    const user = inMemoryUserRepository.exists({ email: newUser.email });

    expect(user).resolves.toBeTruthy();
  });

  it('should return false because not found user', () => {
    const user = inMemoryUserRepository.exists({ document: '12345678911' });

    expect(user).resolves.toBeFalsy();
  });
});

describe('User Repository update method', () => {
  const inMemoryUserRepository = new InMemoryUserRepository();
  it('should throw error because user2 has same email ', () => {
    const user1: TUsers = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    const user2: TUsers = {
      id: '2',
      document: '12345678912',
      name: 'John Doe 2',
      email: 'johndoe@hotmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user1, user2);

    expect(
      inMemoryUserRepository.update(user2.id, {
        email: user1.email
      })
    ).rejects.toThrow(UserWithSameCredentials);
  });

  it('should throw error user with same credentials by document', () => {
    const user1: TUsers = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    const user2: TUsers = {
      id: '2',
      document: '12345678912',
      name: 'John Doe 2',
      email: 'johndoe@hotmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user1, user2);

    expect(
      inMemoryUserRepository.update(user2.id, {
        document: user1.document
      })
    ).rejects.toThrow(UserWithSameCredentials);
  });

  it('should throw error user with same credentials by document and email', () => {
    const user1: TUsers = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    const user2: TUsers = {
      id: '2',
      document: '12345678912',
      name: 'John Doe 2',
      email: 'johndoe@hotmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user1, user2);

    expect(
      inMemoryUserRepository.update(user2.id, {
        document: user1.document,
        email: user1.email
      })
    ).rejects.toThrow(UserWithSameCredentials);
  });

  it('should throw error user with same credentials by document and email', () => {
    const user1: TUsers = {
      id: '1',
      document: '12345678911',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    const user2: TUsers = {
      id: '2',
      document: '12345678912',
      name: 'John Doe 2',
      email: 'johndoe@hotmail.com',
      created_at: new Date(),
      password: 'mypassword',
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    inMemoryUserRepository.users.push(user1, user2);

    expect(
      inMemoryUserRepository.update(user2.id, {
        document: user1.document,
        email: user1.email
      })
    ).rejects.toThrow(UserWithSameCredentials);
  });
});

// describe('User Repository update password method', () => {
//   const inMemoryUserRepository = new InMemoryUserRepository();
//   it('should throw error user with same credentials', () => {
//     const id = randomUUID();
//     const newPassword = 'myNewPassword';

//     expect(
//       inMemoryUserRepository.updatePassword(id, newPassword)
//     ).resolves.toBeUndefined();
//   });
// });
