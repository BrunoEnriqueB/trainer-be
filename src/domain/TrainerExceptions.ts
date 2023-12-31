import { HttpError } from '@src/domain/HttpErrors';

abstract class TrainerException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class TrainerCantAssignHimselfException<T> extends TrainerException<T> {
  constructor() {
    super(400, 'A trainer cannot assign himself as a student');
  }
}

export class TrainerAlreadyExistsException<T> extends TrainerException<T> {
  constructor() {
    super(422, 'Trainer already exists');
  }
}

export class TrainerNotFoundException<T> extends TrainerException<T> {
  constructor() {
    super(404, 'Trainer not found');
  }
}
