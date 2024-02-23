import { Exercises } from '@prisma/client';

export type TFindData = {
  id?: number;
  name?: string;
  trainer_id?: string;
  startsAt?: Date;
  endsAt?: Date;
  limit?: number | 100;
  skip?: number | 0;
};

export type TCreateExercise = Omit<
  Exercises,
  'id' | 'created_at' | 'updated_at'
>;

export interface IExercisesRepository {
  find(data: TFindData): Promise<Exercises[]>;

  create(data: TCreateExercise): Promise<Exercises>;
}
