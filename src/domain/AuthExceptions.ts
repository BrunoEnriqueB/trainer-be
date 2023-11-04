import { HttpError } from '@src/domain/HttpErrors';

abstract class AuthException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class TokenNotAuthorized<T> extends AuthException<T> {
  constructor() {
    super(401, 'Invalid token, not autorized to complete this action');
  }
}

export class UserMustBeATrainer<T> extends AuthException<T> {
  constructor() {
    super(401, 'User must be a trainer to complete this action');
  }
}

export class UserNotFoundException<T> extends AuthException<T> {
  constructor() {
    super(404, 'User not found');
  }
}
