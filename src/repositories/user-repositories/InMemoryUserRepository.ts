import { Users } from '@prisma/client';
import {
  UserAlreadyExistsException,
  UserWithSameCredentials
} from '@src/domain/UserExceptions';
import { randomUUID } from 'node:crypto';
import {
  IUserRepository,
  TCreateUser,
  TUpdateUser,
  TUserIndexes,
  TUsers
} from './UserRepository';
import { UserAlreadyExistsException } from '@src/domain/UserExceptions';

export default class InMemoryUserRepository implements IUserRepository {
  public users: TUsers[] = [];
  async find({ document, email, id }: TUserIndexes): Promise<TUsers | null> {
    const user = this.users.find((user: TUsers) => {
      if (email && !document) {
        return email === user.email;
      }
      if (!email && document) {
        return document === user.document;
      }
      return document === user.document && email === user.email;
    });
    return user || null;
  }

  async create({
    document,
    email,
    name,
    password
  }: TCreateUser): Promise<Users> {
    const userAlreadyExists = this.users.find((user) => {
      return user.document === document || user.email === email;
    });

    if (userAlreadyExists) {
      throw new UserAlreadyExistsException();
    }

    const newUser: TUsers = {
      id: randomUUID(),
      document,
      email,
      name,
      password,
      created_at: new Date(),
      updated_at: new Date(),
      Students: null,
      Trainers: null
    };

    this.users.push(newUser);

    return newUser;
  }

  async exists({ document, email, id }: TUserIndexes): Promise<boolean> {
    return !!this.users.find(
      (user) =>
        user.document === document || user.email === email || user.id === id
    );
  }

  async update(id: string, data: TUpdateUser): Promise<void> {
    const userWithSameId = this.users.find((user) => user.id === id);
    const userWithSameCredentials = this.users.find((user) => {
      if (user.id === id) return;
      if (data.document && !data.email) return user.document === data.document;
      if (!data.document && data.email) return user.email === data.email;

      return user.document === data.document && user.email === data.email;
    });

    if (!userWithSameId) return;
    if (userWithSameCredentials) {
      throw new UserWithSameCredentials();
    }
    for (const key in data) {
      type keyofdata = keyof typeof data;
      userWithSameId[key as keyofdata] = data[key as keyofdata]!;
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);

    if (!user) return;
    user.password = password;
  }
}
