import prisma from '@src/config/client';

import { Users } from '@prisma/client';

import { UpdateUserType, UserType } from '@src/schemas/User';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  UserAlreadyExistsException,
  UserNotFoundException
} from '@src/domain/UserExceptions';

import { userIndexes } from '@src/@types/user';
import { uuidType } from '@src/schemas/Generic';

export default class UserRepository {
  static getUser(userIndexes: userIndexes): Promise<Users | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userIndexes
        });

        resolve(user);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static getUserAndThrow(userIndexes: userIndexes): Promise<Users> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.users.findUnique({
          where: userIndexes
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
