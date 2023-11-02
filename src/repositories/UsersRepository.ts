import prisma from '@src/config/client';

import { Users } from '@prisma/client';

import { UserType } from '@src/schemas/User';

import { InternalServerError } from '@src/domain/HttpErrors';
import {
  UserAlreadyExistsException,
  UserNotFoundException
} from '@src/domain/UserExceptions';
import { userIndexes } from '@src/@types/user';

export default class UserRepository {
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
        const findUser = await prisma.users.findUnique({ where: userIndexes });

        resolve(!!findUser);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
