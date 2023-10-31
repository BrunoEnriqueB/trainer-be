export class HttpError<T> extends Error {
  public statusCode: number;
  public errors: T[];

  constructor(statusCode: number, message?: string, errors?: T[]) {
    super();

    this.statusCode = statusCode;
    this.message = message || 'Internal Server Error';
    this.errors = errors || [];
  }
}

export class BadRequestError<T> extends HttpError<T> {
  constructor(errors?: T[]) {
    super(400, 'Bad Request', errors);
  }
}

export class NotFoundError<T> extends HttpError<T> {
  constructor(errors?: T[]) {
    super(404, 'Not found', errors);
  }
}

export class UnauthorizedError<T> extends HttpError<T> {
  constructor(errors?: T[]) {
    super(401, 'Unauthorized', errors);
  }
}

export class InternalServerError<T> extends HttpError<T> {
  constructor(errors?: T[]) {
    super(500, 'Internal Server Error', errors);
  }
}
