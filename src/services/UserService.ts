import UserRepository from '@src/repositories/UsersRepository';

import { publicUser } from '@src/@types/user';

import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

import {
  UpdateUserType,
  UserType,
  UserUniqueKeysType
} from '@src/schemas/User';
import { uuidType } from '@src/schemas/Generic';

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
      const user = await UserRepository.getUserAndThrow({ id: userId });

      await UserRepository.updateUser(user.id, userData);
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
