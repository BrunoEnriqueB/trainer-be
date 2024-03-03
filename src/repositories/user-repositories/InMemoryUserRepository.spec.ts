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
    expect((await user).document).equal(newUser.document);
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

    expect(user).resolves.toBeNull();
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
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  it(`should throw error because user2 is updating to user1's email`, () => {
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

  it(`should throw error because user2 is updating to user1's document`, () => {
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

  it(`should throw error because user2 is updating to user1's email and document`, () => {
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

  it('should update all user data', () => {
    const user: TUsers = {
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

    inMemoryUserRepository.users.push(user);

    const newEmail = 'johndoe@hotmail.com';
    const newDocument = '12345678910';
    const newName = 'John Doe House';

    const updatedUser: TUsers = {
      ...user,
      document: newDocument,
      email: newEmail,
      name: newName
    };

    expect(
      inMemoryUserRepository.update(user.id, {
        document: newDocument,
        email: newEmail,
        name: newName
      })
    ).resolves.toBeUndefined();
    expect(inMemoryUserRepository.users[0]).toStrictEqual(updatedUser);
  });

  it('should update just user name ', () => {
    const user: TUsers = {
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

    inMemoryUserRepository.users.push(user);
    const newEmail = 'johndoe@hotmail.com';
    const newDocument = '12345678910';
    const newName = 'John Doe House';

    const updatedUser: TUsers = {
      ...user,
      name: newName
    };

    expect(
      inMemoryUserRepository.update(user.id, {
        name: newName
      })
    ).resolves.toBeUndefined();
    expect(inMemoryUserRepository.users[0]).toStrictEqual(updatedUser);
  });

  it('should update just user email', () => {
    const user: TUsers = {
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

    inMemoryUserRepository.users.push(user);

    const newEmail = 'johndoe@hotmail.com';

    const updatedUser: TUsers = {
      ...user,
      email: newEmail
    };

    expect(
      inMemoryUserRepository.update(user.id, {
        email: newEmail
      })
    ).resolves.toBeUndefined();
    expect(inMemoryUserRepository.users[0]).toStrictEqual(updatedUser);
  });

  it('should update just user document', () => {
    const user: TUsers = {
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

    inMemoryUserRepository.users.push(user);

    const newDocument = '12345678910';

    const updatedUser: TUsers = {
      ...user,
      document: newDocument
    };

    expect(
      inMemoryUserRepository.update(user.id, {
        document: newDocument
      })
    ).resolves.toBeUndefined();
    expect(inMemoryUserRepository.users[0]).toStrictEqual(updatedUser);
  });
});

describe('User Repository update password method', () => {
  let inMemoryUserRepository: InMemoryUserRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
  });

  it('should updates user password', () => {
    const user: TUsers = {
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

    inMemoryUserRepository.users.push(user);

    const newPassword = 'myNewPassword';

    const updatedUser: TUsers = {
      ...user,
      password: newPassword
    };

    expect(
      inMemoryUserRepository.updatePassword(user.id, newPassword)
    ).resolves.toBeUndefined();
    expect(inMemoryUserRepository.users[0]).toStrictEqual(updatedUser);
  });
});
