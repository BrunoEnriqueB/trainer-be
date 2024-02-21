import { Exercises } from '@prisma/client';

export type TFindData = {
  id?: string;
  name?: string;
  trainer_id?: string;
  startsAt?: Date;
  endsAt?: Date;
};

export type TCreateExercise = Omit<
  Exercises,
  'id' | 'created_at' | 'updated_at'
>;

export interface IExercisesRepository {
  find(data: TFindData): Promise<Exercises[]>;

  create(data: TCreateExercise): Promise<Exercises>;

  findAll(limit: number, skip: number): Promise<Exercises[]>;
}
