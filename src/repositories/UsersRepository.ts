import prisma from '@src/config/client';

import { Users } from '@prisma/client';

import { UserType, UserUniqueKeysType } from '@src/schemas/User';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  UserAlreadyExistsException,
  UserNotFoundException
} from '@src/domain/UserExceptions';
import { userIndexes } from '@src/@types/user';

export default class UserRepository {
  static getUser(userUniqueKeys: UserUniqueKeysType): Promise<Users> {
    return new Promise(async (resolve, reject): Promise<Users | void> => {
      try {
        const user = await prisma.users.findUnique({
          where: userUniqueKeys
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

  static createUser(user: UserType): Promise<void> {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        const findUser = await prisma.users.findUnique({
          where: { email: user.email }
        });

        if (findUser) {
          return reject(new UserAlreadyExistsException());
        }

        await prisma.users.create({
          data: user
        });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static userExists(userIndexes: userIndexes): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const findUser = await prisma.users.findUnique({ where: userIndexes });

        resolve(!!findUser);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
