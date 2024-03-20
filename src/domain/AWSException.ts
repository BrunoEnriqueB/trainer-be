import { HttpError } from '@src/domain/HttpErrors';

abstract class AWSException<T> extends HttpError<T> {
  constructor(statusCode: number, message: string, errors?: T[]) {
    super(statusCode, message, errors);
  }
}

export class AWSUploadImage<T> extends AWSException<T> {
  constructor() {
    super(400, 'Some error occurred when uploading your video');
  }
}

export class AWSDeleteImage<T> extends AWSException<T> {
  constructor() {
    super(400, 'Some error occurred when deleting your video');
  }
}
