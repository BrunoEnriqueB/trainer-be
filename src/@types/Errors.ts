class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  statusCode = 400;
}

class NotFoundError extends HttpError {
  statusCode = 404;
}

class UnauthorizedError extends HttpError {
  statusCode = 401;
}

export { HttpError, BadRequestError, NotFoundError, UnauthorizedError };
