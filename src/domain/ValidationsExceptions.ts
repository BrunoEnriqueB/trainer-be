import { HttpError } from '@src/domain/HttpErrors';

export class StartsAtLaterThanEndsAt<T> extends HttpError<T> {
  constructor() {
    super(403, 'startsAt should be earlier than endsAt');
  }
}
