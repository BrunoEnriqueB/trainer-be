import { z } from 'zod';
import { name, description, video } from '@schemas/Generic';

const exerciseBody = z.object({
  name,
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

type ExerciseBodyType = z.infer<typeof exerciseBody>;
type NewExerciseType = z.infer<typeof newExercise>;
export { exerciseBody, newExercise, ExerciseBodyType, NewExerciseType };
