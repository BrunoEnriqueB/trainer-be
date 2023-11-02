import UserRepository from '@src/repositories/UsersRepository';

import { publicUser } from '@src/@types/user';

import { hashPassword } from '@src/utils/hashPassword';

import { UserType, UserUniqueKeysType } from '@src/schemas/User';

export default class UserService {
  static async findUser(
    userUniqueKeys: UserUniqueKeysType
  ): Promise<publicUser> {
    try {
      const { id, password, ...user } = await UserRepository.getUser(
        userUniqueKeys
      );

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
}
