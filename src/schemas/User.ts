import { z } from 'zod';
import { name, email, document, password } from '@schemas/Generic';

const user = z.object({
  name,
  email,
  document,
  password
});

const userUniqueKeys = z.object({
  email,
  document
});

const userUniqueKeysPartial = z
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

const userSign = userUniqueKeysPartial.and(z.object({ password }));

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

const changePassword = z.object({
  actualPassword: password,
  newPassword: password
});

type UserType = z.infer<typeof user>;
type UserUniqueKeysPartialType = z.infer<typeof userUniqueKeysPartial>;
type UserUniqueKeysType = z.infer<typeof userUniqueKeys>;
type UserSignType = z.infer<typeof userSign>;
type UpdateUserType = z.infer<typeof updateUser>;
type UserTokenType = z.infer<typeof userToken>;

export {
  user,
  userUniqueKeysPartial,
  updateUser,
  userToken,
  changePassword,
  userUniqueKeys,
  UserType,
  userSign,
  UserUniqueKeysPartialType,
  UserSignType,
  UpdateUserType,
  UserTokenType,
  UserUniqueKeysType
};
