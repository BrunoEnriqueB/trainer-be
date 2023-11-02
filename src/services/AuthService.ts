import Token from '@src/libs/token';

import { Trainers, Users } from '@prisma/client';

import UserRepository from '@src/repositories/UsersRepository';
import TrainerRepository from '@src/repositories/TrainerRepository';

import { UserSignType, UserUniqueKeysType } from '@src/schemas/User';

import { verifyPassword } from '@src/utils/hashPassword';

import { UserNotFoundException } from '@src/domain/UserExceptions';
import { UserMustBeATrainer } from '@src/domain/AuthExceptions';

export default class AuthService {
  static async authUser(user: UserSignType): Promise<string> {
    try {
      const { password, ...keys } = user;

      const userFind = await UserRepository.getUserAndThrow(keys);

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

  static async validateUser(user: UserUniqueKeysType): Promise<Users> {
    try {
      const userFind = await UserRepository.getUserAndThrow(user);

      return userFind;
    } catch (error) {
      throw error;
    }
  }

  static async validateTrainer(user: UserUniqueKeysType): Promise<Trainers> {
    try {
      const userFind = await UserRepository.getUserAndThrow(user);

      const trainerFind = await TrainerRepository.getTrainerByUser(userFind);

      if (!trainerFind) {
        throw new UserMustBeATrainer();
      }

      return trainerFind;
    } catch (error) {
      throw error;
    }
  }
}
