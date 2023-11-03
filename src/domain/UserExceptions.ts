import { HttpError } from '@src/domain/HttpErrors';

abstract class UserException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class UserAlreadyExistsException<T> extends UserException<T> {
  constructor() {
    super(422, 'User already exists');
  }
}

export class UserNotFoundException<T> extends UserException<T> {
  constructor() {
    super(404, 'User not found');
  }
}

export class UserWithSameCredentials<T> extends UserException<T> {
  constructor() {
    super(401, 'An user with this credentials already exists');
  }
}
