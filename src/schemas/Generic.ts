import { z } from 'zod';

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

const email = z
  .string({
    required_error: 'Missing field: email',
    invalid_type_error: 'Email must be a string'
  })
  .trim()
  .email({ message: 'Email invalid' })
  .min(10, { message: 'Email must have at least 10 characters' })
  .max(100, { message: 'Email must have maximum of 100 characters' });

const document = z.union([
  z
    .string({
      required_error: 'Missing field: document',
      invalid_type_error: 'Document must be a string'
    })
    .trim()
    .length(11, { message: 'Document must have 11 or 14 characters' }),
  z
    .string({
      required_error: 'Missing field: document',
      invalid_type_error: 'Document must be a string'
    })
    .trim()
    .length(14, { message: 'Document must have 11 or  14 characters' })
]);

const password = z
  .string({
    required_error: 'Missing field: password',
    invalid_type_error: 'Password must be a string'
  })
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password must contain at least 8 characters, 1 number, 1 uppercase, 1 lower case and 1 special character'
  });

const name = z
  .string({
    required_error: 'Missing field: name',
    invalid_type_error: 'Name must be a string'
  })
  .trim()
  .regex(/^[aA-zZ ]*$/gi)
  .max(100, { message: 'Name must have a maximum of 100 characters' });

const description = z
  .string({
    required_error: 'Missing field: description',
    invalid_type_error: 'Description must be a string'
  })
  .trim()
  .max(500, { message: 'Description must have a maximum of 500 characters' });

const video = z
  .custom<Express.Multer.File>()
  .superRefine((file: Express.Multer.File, ctx: z.RefinementCtx) => {
    if (!file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Missing field: file'
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
  .transform((data) => {
    return {
      ...data,
      originalname: data.originalname
        .toLowerCase()
        .replace(/[ ]/g, '_')
        .replace('.', `_${Date.now()}.`)
    };
  });

const userId = z
  .string({
    required_error: 'Missing field: id',
    invalid_type_error: 'id must be a string'
  })
  .uuid({
    message: 'Id must have an uuid pattern'
  });

const id = z
  .union([
    z.number({
      required_error: 'Missing field: id'
    }),
    z.string({
      required_error: 'Missing field: id'
    })
  ])
  .refine(
    (val) => {
      return !isNaN(Number(val));
    },
    { message: 'Id must be a number' }
  )
  .transform((val) => Number(val))
  .refine(
    (val) => {
      return val > 0;
    },
    { message: 'Id must be a positive number' }
  );

const uuid = z.string().uuid();

type uuidType = z.infer<typeof uuid>;

export {
  name,
  email,
  description,
  uuid,
  video,
  id,
  uuidType,
  document,
  password,
  userId
};
