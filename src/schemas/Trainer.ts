import { z } from 'zod';
import { userUniqueKeysPartial } from '@schemas/User';
import { userId } from '@schemas/Generic';

const trainerId = z
  .string({
    required_error: 'Missing field: trainerId',
    invalid_type_error: 'TrainerId must be a string'
  })
  .trim()
  .uuid({ message: 'TrainerId must be an uuid' });

const trainerUniqueKeys = userUniqueKeysPartial.or(
  z.object({
    id: userId
  })
);

type TrainerUniqueKeysType = z.infer<typeof trainerUniqueKeys>;

export { trainerUniqueKeys, trainerId, TrainerUniqueKeysType };
