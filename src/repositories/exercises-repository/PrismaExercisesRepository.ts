import { Exercises } from '@prisma/client';
import {
  IExercisesRepository,
  TCreateExercise,
  TFindData
} from './ExercisesRepository';

export default class PrismaExercisesRepository implements IExercisesRepository {
  find(data: TFindData): Promise<Exercises[]> {}

  findAll(limit: number, skip: number): Promise<Exercises[]> {}

  create(data: TCreateExercise): Promise<Exercises> {}
}
