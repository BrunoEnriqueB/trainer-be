import { randomUUID } from 'node:crypto';
import { Users } from '@prisma/client';
import {
  IUserRepository,
  TCreateUser,
  TUpdateUser,
  TUserIndexes,
  TUsers
} from './UserRepository';

export default class InMemoryUserRepository implements IUserRepository {
  public users: TUsers[] = [];
  async find(data: TUserIndexes): Promise<TUsers | null> {
    const user = this.users.find((user: TUsers) => {
      return user.document === data.document && user.email === data.email;
    });
    return user ?? null;
  }

  async create({
    document,
    email,
    name,
    password
  }: TCreateUser): Promise<Users> {
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
      (user) => user.document === document || user.email === email
    );
  }

  async update(id: string, data: TUpdateUser): Promise<void> {
    const user = this.users.find((user) => user.id === id);

    if (!user) return;
    for (const key in data) {
      type keyofdata = keyof typeof data;
      user[key as keyofdata] = data[key as keyofdata]!;
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);

    if (!user) return;
    user.password = password;
  }
}
