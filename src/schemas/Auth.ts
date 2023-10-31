import { z } from 'zod';
import { email, password } from '@schemas/Generic';

const sigin = z.object({
  email,
  password
});

export { sigin };
