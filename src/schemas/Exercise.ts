import { z } from 'zod';
import { name, description, video, id } from '@schemas/Generic';
import { trainerId } from './Trainer';

const exerciseBody = z.object({
  name: z
    .string({
      required_error: 'Missing field: name',
      invalid_type_error: 'Name must be a string'
    })
    .trim()
    .regex(/^[aA-zZ ]*$/gi)
    .max(60, { message: 'Name must have a maximum of 60 characters' }),
  description,
  video
});

const newExercise = z.object({
  name,
  description,
  video_url: z
    .string({
      required_error: 'Missing field: video_url',
      invalid_type_error: 'Video_url must be a string'
    })
    .url({
      message: 'Video_url is not a valid url'
    })
});

const exercisesFilters = z.object({
  name: z
    .string({
      required_error: 'Missing field: name',
      invalid_type_error: 'Name must be a string'
    })
    .trim()
    .regex(/^[aA-zZ ]*$/gi)
    .max(60, { message: 'Name must have a maximum of 60 characters' })
    .transform((val) => {
      return {
        search: `%${val.toLowerCase()}%`
      };
    })
    .optional(),
  trainer_id: trainerId.optional(),
  id: id.transform((val) => Number(val)).optional()
});
type ExerciseBodyType = z.infer<typeof exerciseBody>;
type NewExerciseType = z.infer<typeof newExercise>;
type ExercisesFilterType = z.infer<typeof exercisesFilters>;

export {
  exerciseBody,
  newExercise,
  exercisesFilters,
  ExerciseBodyType,
  NewExerciseType,
  ExercisesFilterType
};
