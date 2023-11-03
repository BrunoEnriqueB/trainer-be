import { HttpError } from '@src/domain/HttpErrors';

abstract class StudentException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class StudentAlreadyExistsException<T> extends StudentException<T> {
  constructor() {
    super(422, 'Student already exists');
  }
}

export class StudentNotFoundException<T> extends StudentException<T> {
  constructor() {
    super(404, 'Student not found');
  }
}

export class StudentAlreadyAssignedException<T> extends StudentException<T> {
  constructor() {
    super(400, 'This student is already assigned to this trainer');
  }
}
