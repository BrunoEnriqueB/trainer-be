import { z } from 'zod';

const email = z
  .string({
    required_error: 'Missing field: email',
    invalid_type_error: 'Email must be a string'
  })
  .trim()
  .email({ message: 'Email invalid' })
  .min(10, { message: 'Email must have at least 10 characters' })
  .max(100, { message: 'Email must have maximum of 100 characters' });

const document = z.union([
  z
    .string({
      required_error: 'Missing field: document',
      invalid_type_error: 'Document must be a string'
    })
    .trim()
    .length(11, { message: 'Document must have 11 or 14 characters' }),
  z
    .string({
      required_error: 'Missing field: document',
      invalid_type_error: 'Document must be a string'
    })
    .trim()
    .length(14, { message: 'Document must have 11 or  14 characters' })
]);

const password = z
  .string({
    required_error: 'Missing field: password',
    invalid_type_error: 'Password must be a string'
  })
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain at least 8 characters, 1 number, 1 uppercase, 1 lower case and 1 special character'
  });

const name = z
  .string({
    required_error: 'Missing field: name',
    invalid_type_error: 'Name must be a string'
  })
  .trim()
  .regex(/^[aA-zZ ]*$/gi)
  .max(100, { message: 'Name must have maximum of 100 characters' });

const userId = z
  .string({
    required_error: 'Missing field: id',
    invalid_type_error: 'id must be a string'
  })
  .uuid({
    message: 'Id must have an uuid pattern'
  });

const uuid = z.string().uuid();

type uuidType = z.infer<typeof uuid>;

export { name, email, uuid, uuidType, document, password, userId };
