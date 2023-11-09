import prisma from '@src/config/client';

import { Students, Trainers, Users } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { UpdateUserType, UserType } from '@src/schemas/User';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
  UserWithSameCredentials
} from '@src/domain/UserExceptions';

import { uuidType } from '@src/schemas/Generic';
import { TrainerAndStudentsNull, userIndexes } from '@src/@types/user';

export default class UserRepository {
  static getUserAndForeignKeys(
    userIndexes: userIndexes
  ): Promise<
    (Users & { Trainers: Trainers | null; Students: Students | null }) | null
  > {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userIndexes,
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

  static getUserAndThrow(
    userIndexes: userIndexes
  ): Promise<Users & TrainerAndStudentsNull> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userIndexes,
          include: {
            Students: true,
            Trainers: true
          }
        });

        if (!user) {
          return reject(new UserNotFoundException());
        }

        resolve(user);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static createUser(user: UserType): Promise<Users> {
    return new Promise(async (resolve, reject) => {
      try {
        const findUser = await prisma.users.findMany({
          where: { OR: [{ email: user.email }, { document: user.document }] }
        });

        if (findUser.length) {
          return reject(new UserAlreadyExistsException());
        }

        const newUser = await prisma.users.create({
          data: user
        });

        resolve(newUser);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static userExists(userIndexes: userIndexes): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = [];

        if ('email' in userIndexes) {
          query.push({ email: userIndexes.email });
        }

        if ('document' in userIndexes) {
          query.push({ document: userIndexes.document });
        }

        if ('id' in userIndexes) {
          query.push({ id: userIndexes.id });
        }

        const findUser = await prisma.users.findMany({
          where: { OR: query }
        });

        resolve(!!findUser.length);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static updateUser(
    userId: uuidType,
    userData: UpdateUserType
  ): Promise<Users> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.update({
          where: { id: userId },
          data: userData
        });

        resolve(user);
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

  static changePassword(id: uuidType, password: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.users.update({ where: { id }, data: { password } });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
