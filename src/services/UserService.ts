import {
  IUserRepository,
  TCreateUser,
  TUpdateUser,
  TUserIndexes
} from '@src/repositories/user-repositories/UserRepository';

import { hashPassword, verifyPassword } from '@src/utils/hashPassword';

import { Users } from '@prisma/client';
import { HttpError } from '@src/domain/HttpErrors';
import { UserNotFoundException } from '@src/domain/UserExceptions';

export type TPublicUser = Omit<Users, 'password'>;

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async find(data: TUserIndexes): Promise<TPublicUser> {
    try {
      const findUser = await this.userRepository.find(data);

      if (!findUser) {
        throw new UserNotFoundException();
      }

      const { password, ...user } = findUser;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(user: TCreateUser): Promise<void> {
    try {
      const newPassword = await hashPassword(user.password);

      user.password = newPassword;

      await this.userRepository.create(user);
    } catch (error) {
      throw error;
    }
  }

  async exists(userUniqueKeys: TUserIndexes): Promise<boolean> {
    try {
      return await this.userRepository.exists(userUniqueKeys);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, userData: TUpdateUser) {
    try {
      await this.userRepository.update(id, userData);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    id: string,
    actualPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const findUser = await this.userRepository.find({
        id
      });

      if (!findUser) {
        throw new UserNotFoundException();
      }

      const isPasswordsValid = await verifyPassword(
        actualPassword,
        findUser.password
      );

      if (!isPasswordsValid) {
        throw new HttpError(401, 'Provided password is wrong');
      }

      const hashedPassword = await hashPassword(newPassword);

      await this.userRepository.updatePassword(id, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}
