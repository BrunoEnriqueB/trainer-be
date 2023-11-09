import Token from '@src/libs/token';

import { Trainers, Users } from '@prisma/client';

import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { UserSignType, UserUniqueKeysPartialType } from '@src/schemas/User';

import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

import { UserNotFoundException } from '@src/domain/UserExceptions';
import {
  TokenNotAuthorized,
  UserMustBeATrainer
} from '@src/domain/AuthExceptions';
import { uuidType } from '@src/schemas/Generic';
import generatePassword from '@src/utils/generatePassword';
import sendEmail from '@src/utils/sendEmail';
import { RecoveryPasswordTemplate } from '@src/domain/EmailConstructor';

export default class AuthService {
  static async authUser(user: UserSignType): Promise<string> {
    try {
      const { password, ...keys } = user;

      const userFind = await UserRepository.getUserAndThrow(keys);

      const isPasswordValid = await verifyPassword(password, userFind.password);

      if (!isPasswordValid) {
        throw new UserNotFoundException();
      }

      const token = await Token.createToken(userFind.id);

      return token;
    } catch (error) {
      throw error;
    }
  }

  static async validateUser(userId: uuidType): Promise<Users> {
    try {
      const user = await UserRepository.getUserAndForeignKeys({ id: userId });

      if (!user) {
        throw new TokenNotAuthorized();
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async validateTrainer(userId: uuidType): Promise<Trainers> {
    try {
      const user = await UserRepository.getUserAndForeignKeys({ id: userId });

      if (!user) {
        throw new TokenNotAuthorized();
      }

      if (!user.Trainers) {
        throw new UserMustBeATrainer();
      }

      return user.Trainers;
    } catch (error) {
      throw error;
    }
  }

  static async recoveryUserPassword(user: UserUniqueKeysPartialType) {
    try {
      const findUser = await UserRepository.getUserAndThrow(user);

      const generatedPassword = generatePassword();

      const newUserPassword = await hashPassword(generatedPassword);

      await UserRepository.changePassword(findUser.id, newUserPassword);

      await sendEmail(
        new RecoveryPasswordTemplate([findUser.email], generatedPassword)
      );
    } catch (error) {
      throw error;
    }
  }
}
