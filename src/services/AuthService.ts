import Token from '@src/libs/token';

import UserRepository from '@src/repositories/UsersRepository';

import { UserSignType } from '@src/schemas/User';

import { verifyPassword } from '@src/utils/hashPassword';

import { UserNotFoundException } from '@src/domain/UserExceptions';

export default class AuthService {
  static async authUser(user: UserSignType): Promise<string> {
    try {
      const { password, ...keys } = user;

      const userFind = await UserRepository.getUser(keys);

      const isPasswordValid = await verifyPassword(password, userFind.password);

      if (!isPasswordValid) {
        throw new UserNotFoundException();
      }

      const token = await Token.createToken(userFind);

      return token;
    } catch (error) {
      throw error;
    }
  }
}
