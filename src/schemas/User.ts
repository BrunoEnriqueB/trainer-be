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

type UserType = z.infer<typeof user>;
type UserUniqueKeysType = z.infer<typeof userUniqueKeys>;
type UserSignType = z.infer<typeof userSign>;

export {
  user,
  userUniqueKeys,
  UserType,
  userSign,
  UserUniqueKeysType,
  UserSignType
};
