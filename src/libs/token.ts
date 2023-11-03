import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { HttpError, UnauthorizedError } from '@src/domain/HttpErrors';

import { uuidType } from '@src/schemas/Generic';
import { UserTokenType, userToken } from '@src/schemas/User';
import { ZodError } from 'zod';

const secret = process.env.SECRET as string;

export default class Token {
  static async createToken(userId: uuidType): Promise<string> {
    const token = jwt.sign({ id: userId }, secret);

    return token;
  }

  static async getUserInToken(token: string): Promise<UserTokenType> {
    try {
      const user = jwt.verify(token, secret);

      userToken.parse(user);

      return user as UserTokenType;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpError(401, 'Invalid token');
      }

      if (error instanceof JsonWebTokenError) {
        throw new HttpError(401, error.message);
      }

      throw new UnauthorizedError();
    }
  }
}
