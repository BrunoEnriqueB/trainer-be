import { HttpError } from '@src/domain/HttpErrors';

abstract class ExerciseException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class ExerciseNotFoundException<T> extends ExerciseException<T> {
  constructor() {
    super(404, 'Exercise not found');
  }
}

export class ExerciseAlreadyExistsException<T> extends ExerciseException<T> {
  constructor() {
    super(422, 'You have already registered an exercise with this name');
  }
}
