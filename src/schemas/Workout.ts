import { description, id, student_id } from '@schemas/Generic';
import ACCEPTED_MIME_TYPES from '@src/global/accepted_mime_types';
import { z } from 'zod';
import { trainerId } from './Trainer';

const workout = z.object({
  name: z
    .string({
      required_error: 'Missing field: name',
      invalid_type_error: 'Name must be a string'
    })
    .trim()
    .regex(/^[aA-zZ ]*$/gi)
    .max(60, { message: 'Name must have a maximum of 60 characters' }),
  description
});

const createWorkoutBody = workout
  .and(
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
  )
  .transform((data) => {
    return {
      ...data,
      logo: {
        ...data.logo,
        originalname: `${data.name
          .toLowerCase()
          .replace(/[ ]/g, '_')
          .replace(/\W+/g, '')}_${Date.now()}.${
          data.logo.mimetype.split('/')[1]
        }`
      }
    };
  });

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
    .regex(/[aA-zZ]/gi, {
      message: 'The name of train must have just letters'
    })
    .max(60, { message: 'Name must have a maximum of 60 characters' })
    .optional(),
  trainers: z.array(trainerId).optional(),
  students: z.array(student_id).optional(),
  exercises: z
    .array(z.string())
    .superRefine((data: string[], ctx: z.RefinementCtx) => {
      for (const value of data) {
        if (isNaN(Number(value))) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: 'number',
            received: 'string',
            message: 'exercises must be an array of integer'
          });
        }
      }
    })
    .transform((data) => {
      return data.map((value) => Number(value));
    })
    .optional(),
  id: id.transform((val) => Number(val)).optional(),
  scheduledAt: z
    .array(z.string())
    .superRefine((data: string[], ctx: z.RefinementCtx) => {
      for (const value of data) {
        if (isNaN(Number(value))) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: 'number',
            received: 'string',
            message: 'scheduledAt must be an array of integer'
          });
        }
      }
    })
    .transform((data) => {
      return data.map((value) => Number(value));
    })
    .optional(),
  startsAt: z
    .string({
      required_error: 'Missing field: startAt',
      invalid_type_error: 'startAt must be a string'
    })
    .regex(
      /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/gm,
      'startsAt must follow the pattern: yyyy-mm-dd'
    )
    .superRefine((date: string, ctx: z.RefinementCtx) => {
      const testDate = new Date(date);

      if (testDate instanceof Date && isNaN(testDate.valueOf())) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'startsAt is not a valid date'
        });
      }
    })
    .optional(),
  endsAt: z
    .string({
      required_error: 'Missing field: endsAt',
      invalid_type_error: 'endsAt must be a string'
    })
    .regex(
      /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/gm,
      'endsAt must follow the pattern: yyyy-mm-dd'
    )
    .superRefine((date: string, ctx: z.RefinementCtx) => {
      const testDate = new Date(date);

      if (testDate instanceof Date && isNaN(testDate.valueOf())) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: 'endsAt is not a valid date'
        });
      }
    })
    .optional()
});

const findWorkoutByIdParams = z.object({
  id
});

const updateWorkoutStudentsBody = z
  .object({
    workout_id: z
      .number({
        required_error: 'Missing field: workout_id',
        invalid_type_error: 'workout_id must be a number'
      })
      .int({ message: 'workout_id must be a number' }),
    add: z
      .array(
        z.object(
          {
            student_id,
            schedule: z.array(z.number().int().gte(0).lte(6)).min(0).max(6)
          },
          {
            invalid_type_error:
              'items in add should be like: { student_id: "8e2ddda1-07af-4b6c-a831-a5179d22ad09", schedule: [0, 2, 4] }',
            required_error: 'Missing required fields: add'
          }
        )
      )
      .superRefine((data, ctx: z.RefinementCtx) => {
        const mappedData: { [key: string]: number } = {};

        for (const student of data) {
          mappedData[student.student_id] = mappedData[student.student_id]
            ? ++mappedData[student.student_id]
            : 1;
        }

        const duplicatedStudents = Object.keys(mappedData).filter(
          (d) => mappedData[d] > 1
        );

        if (duplicatedStudents.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `There are some duplicated students in array add: [${duplicatedStudents}]`
          });
        }
      }),
    remove: z.array(
      z.string({
        invalid_type_error:
          'items in remove should be like: [ "8e2ddda1-07af-4b6c-a831-a5179d22ad09" ] ',
        required_error: 'Missing required field: remove'
      })
    )
  })
  .superRefine((data, ctx: z.RefinementCtx) => {
    data.add.forEach((add) => {
      if (data.remove.find((remove) => remove === add.student_id))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'You cannot add and remove a student at the same time'
        });
    });
  })
  .transform((data, ctx: z.RefinementCtx) => {
    const remove = [...new Set(data.remove)];

    return {
      add: data.add,
      remove,
      workout_id: data.workout_id
    };
  });

const updateWorkoutExercisesBody = z
  .object({
    workout_id: z
      .number({
        required_error: 'Missing field: workout_id',
        invalid_type_error: 'workout_id must be a number'
      })
      .int({ message: 'workout_id must be a number' }),
    add: z.array(
      z.number({
        invalid_type_error: 'items in add must be numbers',
        required_error: 'Missing required field: add'
      })
    ),
    remove: z.array(
      z.number({
        invalid_type_error: 'items in remove must be numbers',
        required_error: 'Missing required field: remove'
      })
    )
  })
  .superRefine((data, ctx: z.RefinementCtx) => {
    data.add.forEach((add) => {
      if (data.remove.find((remove) => remove === add))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'You cannot add and remove an exercise at the same time'
        });
    });
  })
  .transform((data, ctx: z.RefinementCtx) => {
    const remove = [...new Set(data.remove)];
    const add = [...new Set(data.add)];

    return {
      add,
      remove,
      workout_id: data.workout_id
    };
  });

type WorkoutBodyType = z.infer<typeof createWorkoutBody>;
type NewWorkoutType = z.infer<typeof newWorkout>;
type WorkoutFiltersType = z.infer<typeof workoutFilters>;
type UpdateWorkoutStudentsBodyType = z.infer<typeof updateWorkoutStudentsBody>;
type UpdateWorkoutExercisesBodyType = z.infer<
  typeof updateWorkoutExercisesBody
>;

export {
  NewWorkoutType,
  UpdateWorkoutExercisesBodyType,
  UpdateWorkoutStudentsBodyType,
  WorkoutBodyType,
  WorkoutFiltersType,
  createWorkoutBody,
  findWorkoutByIdParams,
  newWorkout,
  updateWorkoutExercisesBody,
  updateWorkoutStudentsBody,
  workout,
  workoutFilters
};
