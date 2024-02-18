import { Users } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalServerError } from '@src/domain/HttpErrors';
import {
  UserAlreadyExistsException,
  UserWithSameCredentials
} from '@src/domain/UserExceptions';
import { prisma } from '@src/libs/client';
import {
  IUserRepository,
  TCreateUser,
  TUpdateUser,
  TUserIndexes,
  TUsers
} from '@src/repositories/user-repositories/UserRepository';

export default class PrismaUserRepository implements IUserRepository {
  async find(data: TUserIndexes): Promise<TUsers | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: data,
          include: {
            Students: true,
            Trainers: true
          }
        });

        resolve(user);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  async create(data: TCreateUser): Promise<Users> {
    return new Promise(async (resolve, reject) => {
      try {
        const findUser = await prisma.users.findMany({
          where: { OR: [{ email: data.email }, { document: data.document }] }
        });

        if (findUser.length) {
          return reject(new UserAlreadyExistsException());
        }

        const user = await prisma.users.create({
          data: {
            document: data.document,
            email: data.email,
            name: data.name,
            password: data.password
          }
        });

        resolve(user);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  async exists(data: TUserIndexes): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          !!prisma.users.findFirst({
            where: { OR: [data] }
          })
        );
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  async update(id: string, data: TUpdateUser): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.users.update({
          where: { id },
          data
        });

        resolve();
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          const prismaError = error as PrismaClientKnownRequestError;

          if (prismaError.code === 'P2002') {
            return reject(new UserWithSameCredentials());
          }
        }

        return reject(new InternalServerError());
      }
    });
  }
  async updatePassword(id: string, password: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.users.update({
          where: { id },
          data: { password }
        });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
