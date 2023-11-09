import { z } from 'zod';
import { userUniqueKeysPartial } from '@schemas/User';
import { userId } from '@schemas/Generic';

const trainerUniqueKeys = userUniqueKeysPartial.or(
  z.object({
    id: userId
  })
);

type TrainerUniqueKeysType = z.infer<typeof trainerUniqueKeys>;

export { trainerUniqueKeys, TrainerUniqueKeysType };
