import UserRepository from '@src/repositories/UsersRepository';

import { publicUser, userIndexes } from '@src/@types/user';

import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

import { Users } from '@prisma/client';

import {
  UpdateUserType,
  UserType,
  UserUniqueKeysType
} from '@src/schemas/User';
import { uuidType } from '@src/schemas/Generic';

import { UserWithSameCredentials } from '@src/domain/UserExceptions';
import { HttpError } from '@src/domain/HttpErrors';

export default class UserService {
  static async findUserById(userId: uuidType): Promise<publicUser> {
    try {
      const { password, ...user } = await UserRepository.getUserAndThrow({
        id: userId
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(user: UserType) {
    try {
      const newPassword = await hashPassword(user.password);

      user.password = newPassword;

      await UserRepository.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  static async userExists(
    userUniqueKeys: UserUniqueKeysType
  ): Promise<boolean> {
    try {
      return await UserRepository.userExists(userUniqueKeys);
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId: uuidType, userData: UpdateUserType) {
    try {
      const promises: Promise<Users | boolean>[] = [
        UserRepository.getUserAndThrow({ id: userId }),
        UserRepository.userExists(userData as userIndexes)
      ];

      const promisesResult = await Promise.all(promises);

      const user = promisesResult[0] as Users;

      const hasDifferentEmail =
        !!userData.email && userData.email !== user.email;
      const hasDifferentDocument =
        !!userData.document && userData.document !== user.document;

      if (hasDifferentEmail || hasDifferentDocument) {
        const userWithSameCredentials = promisesResult[1];

        if (userWithSameCredentials) {
          throw new UserWithSameCredentials();
        }
      }

      await UserRepository.updateUser(userId, userData);
    } catch (error) {
      throw error;
    }
  }

  static async changePassword(
    userId: uuidType,
    actualPassword: string,
    newPassword: string
  ) {
    try {
      const findUser = await UserRepository.getUserAndThrow({ id: userId });

      const isPasswordsValid = await verifyPassword(
        actualPassword,
        findUser.password
      );

      if (!isPasswordsValid) {
        throw new HttpError(401, 'Provided password is wrong');
      }

      const hashedPassword = await hashPassword(newPassword);

      await UserRepository.changePassword(findUser.id, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}
