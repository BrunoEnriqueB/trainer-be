import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { userData } from '@src/@types/user';
import { HttpError, UnauthorizedError } from '@src/domain/HttpErrors';

const secret = process.env.SECRET as string;

type userToken = {
  iat: number;
} & userData;

export default class Token {
  static async createToken(user: userData): Promise<string> {
    const token = jwt.sign(
      { document: user.document, email: user.email },
      secret
    );

    return token;
  }

  static async getUserInToken(token: string): Promise<userToken> {
    try {
      const user = jwt.verify(token, secret);

      return user as userToken;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new HttpError(401, error.message);
      }

      throw new UnauthorizedError();
    }
  }
}
