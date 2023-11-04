import { HttpError } from '@src/domain/HttpErrors';

abstract class EmailSenderException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class EmailServiceUnavailableException<
  T
> extends EmailSenderException<T> {
  constructor() {
    super(503, 'Email sender service unavailable');
  }
}
