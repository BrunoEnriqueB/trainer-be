import jwt from 'jsonwebtoken';

import { userData } from '@src/@types/user';
import { UnauthorizedError } from '@src/domain/HttpErrors';

const secret = process.env.SECRET as string;

export default class Token {
  static async createToken(user: userData): Promise<string> {
    const token = jwt.sign(
      { document: user.document, email: user.email },
      secret
    );

    return token;
  }

  static async getUserInToken(token: string): Promise<userData> {
    try {
      const user = jwt.verify(token, secret);

      return user as userData;
    } catch (error) {
      throw new UnauthorizedError();
    }
  }
}
