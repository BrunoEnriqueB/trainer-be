import { z } from 'zod';
import { name, email, document, password } from '@schemas/Generic';

const user = z.object({
  name,
  email,
  document,
  password
});

const userUniqueKeys = z
  .object({
    email,
    document
  })
  .or(
    z.object({
      email
    })
  )
  .or(
    z.object({
      document
    })
  );

const userSign = userUniqueKeys.and(z.object({ password }));

const updateUser = z
  .object({
    name,
    email,
    document
  })
  .partial();

const userToken = z.object({
  iat: z.number(),
  id: z
    .string({
      required_error: 'Missing required field: id',
      invalid_type_error: 'Id must be a string uuid'
    })
    .uuid()
});

type UserType = z.infer<typeof user>;
type UserUniqueKeysType = z.infer<typeof userUniqueKeys>;
type UserSignType = z.infer<typeof userSign>;
type UpdateUserType = z.infer<typeof updateUser>;
type UserTokenType = z.infer<typeof userToken>;

export {
  user,
  userUniqueKeys,
  updateUser,
  userToken,
  UserType,
  userSign,
  UserUniqueKeysType,
  UserSignType,
  UpdateUserType,
  UserTokenType
};
