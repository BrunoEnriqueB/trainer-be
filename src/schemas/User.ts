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

const updateUser = user.partial();

type UserType = z.infer<typeof user>;
type UserUniqueKeysType = z.infer<typeof userUniqueKeys>;
type UserSignType = z.infer<typeof userSign>;
type UpdateUserType = z.infer<typeof updateUser>;

export {
  user,
  userUniqueKeys,
  updateUser,
  UserType,
  userSign,
  UserUniqueKeysType,
  UserSignType,
  UpdateUserType
};
