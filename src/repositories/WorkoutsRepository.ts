import prisma from '@src/config/client';

import { Exercises, Prisma, Workouts } from '@prisma/client';

import { InternalServerError } from '@src/domain/HttpErrors';

import { ExercisesNotAssignedWithThisTrainer } from '@src/domain/ExerciseExceptions';
import { StudentsNotAssignedWithThisTrainer } from '@src/domain/StudentExceptions';
import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';
import {
  WorkoutAlreadyExistsException,
  WorkoutNotFoundException
} from '@src/domain/WorkoutException';
import { DateUtils } from '@src/utils/date';

export type TWorkoutAndExercisesAndStudents = Workouts & {
  exercises: Exercises[];
  students: {
    id: string;
    name: string;
    student_id: string;
  }[];
};

export type TCreateWorkoutArgs = {
  name: string;
  description: string;
  logo_url: string;
  video_name: string;
};

export type TWorkoutFilters = Partial<{
  name: string;
  students: string[];
  trainers: string[];
  id: number;
  startsAt: DateUtils;
  endsAt: DateUtils;
  scheduledAt: number[];
  exercises: number[];
}>;

export type TWorkoutXStudentsArgs = {
  student_id: string;
  schedule: number[];
};

export type TUpdateWorkoutStudentsSchema = {
  trainer_id: string;
  workout_id: number;
  add: Array<{
    student_id: string;
    schedule: number[];
  }>;
  remove: string[];
};

export type TUpdateWorkoutExercisesSchema = {
  trainer_id: string;
  workout_id: number;
  add: number[];
  remove: number[];
};

export type ListedWorkouts = Workouts & {
  students: Array<{
    student_id: string;
    schedules: number[];
  }>;
  exercises: number[];
};

interface ICreateManyWorkoutWithStudentsInput extends TWorkoutXStudentsArgs {
  workout_id: number;
}

export default class WorkoutRepository {
  static async create(
    trainer_id: string,
    workout: TCreateWorkoutArgs
  ): Promise<Workouts> {
    return new Promise(async (resolve, reject) => {
      try {
        const trainer = await prisma.trainers.count({
          where: { trainer_id }
        });

        if (!trainer) {
          throw new TrainerNotFoundException();
        }

        const findWorkout = await prisma.workouts.findUnique({
          where: { trainer_id_name: { name: workout.name, trainer_id } }
        });

        if (findWorkout) {
          return reject(new WorkoutAlreadyExistsException());
        }

        const newWorkout = await prisma.workouts.create({
          data: {
            name: workout.name,
            description: workout.description,
            logo_url: workout.logo_url,
            trainer_id
          }
        });

        resolve(newWorkout);
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async list(filters: TWorkoutFilters): Promise<ListedWorkouts[]> {
    {
      return new Promise(async (resolve, reject) => {
        try {
          const where: Prisma.WorkoutsWhereInput = {};

          if (filters.id) where.id = filters.id;
          if (filters.name)
            where.name = { contains: filters.name, mode: 'insensitive' };

          if (filters.trainers && filters.trainers.length)
            where.trainer_id = {
              in: filters.trainers
            };

          if (filters.startsAt || filters.endsAt) {
            where.created_at = {};

            if (filters.startsAt) {
              where.created_at.gte = filters.startsAt;
            }

            if (filters.endsAt) {
              where.created_at.lte = filters.endsAt;
            }
          }

          const scheduledAt = filters.scheduledAt
            ? [...new Set(filters.scheduledAt)]
            : null;

          if (filters.students || scheduledAt) {
            where.Workouts_Students = {
              some: {}
            };

            if (filters.students?.length) {
              where.Workouts_Students['some']!.student_id = {
                in: filters.students
              };
              where.Workouts_Students = {
                some: {
                  student_id: {
                    in: filters.students
                  }
                }
              };
            }

            if (scheduledAt) {
              where.Workouts_Students['some']!.schedule = {
                hasSome: scheduledAt
              };
            }
          }

          if (filters.exercises) {
            where.Workout_Exercices = {
              some: {
                exercise_id: {
                  in: filters.exercises
                }
              }
            };
          }

          const workouts = await prisma.workouts.findMany({
            where,
            include: {
              Workouts_Students: true,
              Workout_Exercices: true
            },
            orderBy: [
              {
                created_at: 'desc'
              }
            ]
          });

          let listedWorkouts: ListedWorkouts[] = workouts.map((workout) => {
            return {
              id: workout.id,
              name: workout.name,
              trainer_id: workout.trainer_id,
              description: workout.description,
              created_at: workout.created_at,
              updated_at: workout.updated_at,
              logo_url: workout.logo_url,
              students: workout.Workouts_Students.map((wxs) => {
                return {
                  student_id: wxs.student_id,
                  schedules: wxs.schedule
                };
              }),
              exercises: workout.Workout_Exercices.map((wxs) => wxs.exercise_id)
            };
          });

          resolve(listedWorkouts);
        } catch (error) {
          return reject(new InternalServerError());
        }
      });
    }
  }

  //TODO: adicionar retorno de estudantes do treino também
  static async findById(id: number): Promise<TWorkoutAndExercisesAndStudents> {
    {
      return new Promise(async (resolve, reject) => {
        try {
          const workout = await prisma.workouts.findUnique({
            where: { id },
            include: {
              Workouts_Students: {
                include: {
                  Student: {
                    include: {
                      userId: true
                    }
                  }
                }
              },
              Workout_Exercices: {
                include: {
                  exerciseId: true
                }
              }
            }
          });

          if (!workout) {
            return reject(new WorkoutNotFoundException());
          }

          const response: TWorkoutAndExercisesAndStudents = {
            id: workout.id,
            name: workout.name,
            description: workout.description,
            trainer_id: workout.trainer_id,
            logo_url: workout.logo_url,
            created_at: workout.created_at,
            updated_at: workout.updated_at,
            exercises: workout.Workout_Exercices.map((we) => we.exerciseId),
            students: workout.Workouts_Students.map(({ Student }) => {
              return {
                id: Student.userId.id,
                name: Student.userId.name,
                student_id: Student.student_id
              };
            })
          };

          resolve(response);
        } catch (error) {
          return reject(new InternalServerError());
        }
      });
    }
  }

  static async assignStudents(
    trainer_id: string,
    workout_id: number,
    data: TWorkoutXStudentsArgs[]
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const workout = prisma.workouts.findUnique({
          where: { id: workout_id }
        });

        if (!workout) {
          return reject(new WorkoutNotFoundException());
        }

        const studentsId = data.map((d) => d.student_id);

        const nonStudentsByTrainer = await getStudentsNonAssignedToATrainer(
          trainer_id,
          studentsId
        );

        if (nonStudentsByTrainer.length) {
          return reject(
            new StudentsNotAssignedWithThisTrainer(nonStudentsByTrainer)
          );
        }

        const workoutXStudents: ICreateManyWorkoutWithStudentsInput[] =
          data.map((arg) => {
            return {
              student_id: arg.student_id,
              workout_id,
              schedule: arg.schedule
            };
          });

        await prisma.workouts_Students.createMany({
          data: workoutXStudents,
          skipDuplicates: true
        });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async unassignStudents(
    trainer_id: string,
    workout_id: number,
    studentsId: string[]
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const workout = prisma.workouts.findUnique({
          where: { id: workout_id }
        });

        if (!workout) {
          return reject(new WorkoutNotFoundException());
        }

        const nonStudentsByTrainer = await getStudentsNonAssignedToATrainer(
          trainer_id,
          studentsId
        );

        if (nonStudentsByTrainer.length) {
          return reject(
            new StudentsNotAssignedWithThisTrainer(nonStudentsByTrainer)
          );
        }

        await prisma.workouts_Students.deleteMany({
          where: {
            workout_id,
            student_id: {
              in: studentsId
            }
          }
        });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async updateAssignedStudents({
    trainer_id,
    workout_id,
    add,
    remove
  }: TUpdateWorkoutStudentsSchema): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const workout = prisma.workouts.findUnique({
          where: { id: workout_id }
        });

        if (!workout) {
          return reject(new WorkoutNotFoundException());
        }

        const nonExercisesByTrainer = await getStudentsNonAssignedToATrainer(
          trainer_id,
          [...add.map((student) => student.student_id), ...remove]
        );

        if (nonExercisesByTrainer.length) {
          return reject(
            new StudentsNotAssignedWithThisTrainer(nonExercisesByTrainer)
          );
        }

        const workoutXStudents: ICreateManyWorkoutWithStudentsInput[] = add.map(
          (arg) => {
            return {
              student_id: arg.student_id,
              workout_id,
              schedule: arg.schedule
            };
          }
        );

        await prisma.$transaction(
          [
            prisma.workouts_Students.createMany({
              data: workoutXStudents,
              skipDuplicates: true
            }),
            prisma.workouts_Students.deleteMany({
              where: {
                workout_id,
                student_id: {
                  in: remove
                }
              }
            })
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
          }
        );
        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }

  static async updateAssignedExercises({
    trainer_id,
    workout_id,
    add,
    remove
  }: TUpdateWorkoutExercisesSchema): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const workout = prisma.workouts.findUnique({
          where: { id: workout_id }
        });

        if (!workout) {
          return reject(new WorkoutNotFoundException());
        }

        const nonExercisesByTrainer = await getExercisesNonAssignedToATrainer(
          trainer_id,
          [...add, ...remove]
        );

        if (nonExercisesByTrainer.length) {
          return reject(
            new ExercisesNotAssignedWithThisTrainer(nonExercisesByTrainer)
          );
        }

        await prisma.$transaction(
          [
            prisma.workout_Exercices.createMany({
              data: add.map((exercise) => {
                return {
                  exercise_id: exercise,
                  workout_id
                };
              }),
              skipDuplicates: true
            }),
            prisma.workout_Exercices.deleteMany({
              where: {
                workout_id,
                exercise_id: {
                  in: remove
                }
              }
            })
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
          }
        );
        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}

async function getStudentsNonAssignedToATrainer(
  trainer_id: string,
  studentsId: string[]
): Promise<string[]> {
  try {
    const studentsByTrainer = await prisma.trainer_Students.findMany({
      where: {
        trainer_id,
        student_id: {
          in: studentsId
        }
      }
    });

    const nonStudentsByTrainer: string[] = [];
    if (studentsId.length !== studentsByTrainer.length) {
      for (const studentId of studentsId) {
        if (!studentsByTrainer.find((s) => s.student_id === studentId)) {
          nonStudentsByTrainer.push(studentId);
        }
      }
    }
    return nonStudentsByTrainer;
  } catch (error) {
    throw error;
  }
}

async function getExercisesNonAssignedToATrainer(
  trainer_id: string,
  exercises: number[]
): Promise<number[]> {
  try {
    const exercisesByTrainer = await prisma.exercises.findMany({
      where: {
        trainer_id,
        id: {
          in: exercises
        }
      }
    });

    const nonexercisesByTrainer: number[] = [];
    if (exercises.length !== exercisesByTrainer.length) {
      for (const exercise of exercises) {
        if (!exercisesByTrainer.find((s) => s.id === exercise)) {
          nonexercisesByTrainer.push(exercise);
        }
      }
    }
    return nonexercisesByTrainer;
  } catch (error) {
    throw error;
  }
}
