import { Workouts } from '@prisma/client';
import { HttpError } from '@src/domain/HttpErrors';
import {
  WorkoutAlreadyExistsException,
  WorkoutDoesNotRelationedWithThisTrainer
} from '@src/domain/WorkoutException';
import {
  TCreateWorkoutArgs,
  TWorkoutAndExercisesAndStudents,
  TWorkoutXStudentsArgs,
  default as WorkoutsRepository
} from '@src/repositories/WorkoutsRepository';
import { WorkoutFiltersType } from '@src/schemas/Workout';
import { DateUtils } from '@src/utils/date';
import AwsServices from './AWSServices';

export type TUpdateAssignedStudentsService = {
  trainer_id: string;
  workout_id: number;
  add: Array<{
    student_id: string;
    schedule: [];
  }>;
  remove: string[];
};

export type TUpdateAssignedExercisesService = {
  trainer_id: string;
  workout_id: number;
  add: number[];
  remove: number[];
};

export default class WorkoutService {
  static async create(
    trainer_id: string,
    workout: TCreateWorkoutArgs
  ): Promise<void> {
    try {
      await WorkoutsRepository.create(trainer_id, workout);
    } catch (error) {
      if (error instanceof WorkoutAlreadyExistsException) {
        const awsServices = new AwsServices();

        await awsServices.deleteFile(workout.video_name);
      }
      throw error;
    }
  }

  static async list(filters: WorkoutFiltersType): Promise<Workouts[]> {
    try {
      if (
        filters.startsAt &&
        filters.endsAt &&
        filters.startsAt > filters.endsAt
      ) {
        throw new HttpError(422, 'endsAt must be later than startsAt');
      }

      const startsAt = filters.startsAt
        ? new DateUtils(filters.startsAt).startOf('day')
        : undefined;
      const endsAt = filters.endsAt
        ? new DateUtils(filters.endsAt).endOf('day')
        : undefined;

      const workouts: Workouts[] = await WorkoutsRepository.list({
        id: filters.id,
        name: filters.name,
        student_id: filters.student_id,
        trainer_id: filters.trainer_id,
        startsAt,
        endsAt
      });

      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findById(
    workout_id: number
  ): Promise<TWorkoutAndExercisesAndStudents> {
    try {
      const workout = await WorkoutsRepository.findById(workout_id);

      return workout;
    } catch (error) {
      throw error;
    }
  }

  static async assignStudents(
    trainer_id: string,
    workout_id: number,
    data: TWorkoutXStudentsArgs[]
  ): Promise<void> {
    try {
      const workout = await WorkoutsRepository.findById(workout_id);

      if (workout.trainer_id !== trainer_id) {
        throw new WorkoutDoesNotRelationedWithThisTrainer();
      }

      await WorkoutsRepository.assignStudents(trainer_id, workout_id, data);
    } catch (error) {
      throw error;
    }
  }

  static async unassignStudents(
    trainer_id: string,
    workout_id: number,
    studentsIds: string[]
  ): Promise<void> {
    try {
      const workout = await WorkoutsRepository.findById(workout_id);

      if (workout.trainer_id !== trainer_id) {
        throw new WorkoutDoesNotRelationedWithThisTrainer();
      }

      await WorkoutsRepository.unassignStudents(
        trainer_id,
        workout_id,
        studentsIds
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateAssignedStudents(
    data: TUpdateAssignedStudentsService
  ): Promise<void> {
    try {
      const workout = await WorkoutsRepository.findById(data.workout_id);

      if (workout.trainer_id !== data.trainer_id) {
        throw new WorkoutDoesNotRelationedWithThisTrainer();
      }

      await WorkoutsRepository.updateAssignedStudents({
        trainer_id: data.trainer_id,
        workout_id: data.workout_id,
        add: data.add,
        remove: data.remove
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateAssignedExercises(
    data: TUpdateAssignedExercisesService
  ): Promise<void> {
    try {
      const workout = await WorkoutsRepository.findById(data.workout_id);

      if (workout.trainer_id !== data.trainer_id) {
        throw new WorkoutDoesNotRelationedWithThisTrainer();
      }

      await WorkoutsRepository.updateAssignedExercises({
        trainer_id: data.trainer_id,
        workout_id: data.workout_id,
        add: data.add,
        remove: data.remove
      });
    } catch (error) {
      throw error;
    }
  }
}
