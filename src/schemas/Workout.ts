import { z } from 'zod';
import { description, id } from '@schemas/Generic';
import { trainerId } from './Trainer';

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'];

const workout = z.object({
  name: z
    .string({
      required_error: 'Missing field: name',
      invalid_type_error: 'Name must be a string'
    })
    .trim()
    .regex(/^[aA-zZ ]*$/gi)
    .max(60, { message: 'Name must have a maximum of 60 characters' }),
  description,
  schedule: z
    .number({
      required_error: 'Missing field: schedule',
      invalid_type_error: 'schedule must be a number'
    })
    .max(200, {
      message: 'schedule must have a maximum of 200 characters'
    }),

  student_id: z
    .string({
      required_error: 'Missing field: student_id',
      invalid_type_error: 'student_id must be a string'
    })
    .uuid({
      message: 'student_id must have an uuid pattern'
    }),
  exercises: z
    .array(z.number(), {
      invalid_type_error:
        'Exercises must be an array of integers containing the exercises ids'
    })
    .optional()
});

const workoutBody = workout.and(
  z.object({
    logo: z
      .custom<Express.Multer.File>()
      .superRefine((file: Express.Multer.File, ctx: z.RefinementCtx) => {
        if (!file) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Missing field: logo'
          });
          return;
        }

        if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
              ', '
            )}] but was ${file.mimetype}`
          });
        }
      })
  })
);

const newWorkout = workout.and(
  z.object({
    logo_url: z
      .string({
        required_error: 'Missing field: logo_url',
        invalid_type_error: 'logo_url must be a string'
      })
      .url({
        message: 'logo_url is not a valid url'
      })
  })
);

const workoutFilters = z.object({
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
  student_id: z
    .string({
      required_error: 'Missing field: student_id',
      invalid_type_error: 'student_id must be a string'
    })
    .uuid({
      message: 'student_id must have an uuid pattern'
    }),

  id: id.transform((val) => Number(val)).optional()
});

type WorkoutBodyType = z.infer<typeof workoutBody>;
type NewWorkoutType = z.infer<typeof newWorkout>;
type WorkoutFiltersType = z.infer<typeof workoutFilters>;

export {
  workout,
  workoutBody,
  newWorkout,
  workoutFilters,
  WorkoutBodyType,
  NewWorkoutType,
  WorkoutFiltersType
};
