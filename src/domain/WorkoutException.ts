import { HttpError } from '@src/domain/HttpErrors';

abstract class WorkoutException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class WorkoutNotFoundException<T> extends WorkoutException<T> {
  constructor() {
    super(404, 'Workout not found');
  }
}

export class WorkoutAlreadyExistsException<T> extends WorkoutException<T> {
  constructor() {
    super(422, 'You have already registered an workout with this name');
  }
}
