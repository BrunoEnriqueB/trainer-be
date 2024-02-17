import { Students, Trainers, Users } from '@prisma/client';

import { RequireAtLeastOne } from '@src/@types';

export type TUserIndexes = RequireAtLeastOne<
  { id: string; email: string; document: string },
  'document' | 'email' | 'id'
>;

export type TUsers =
  | Users & { Trainers: Trainers | null; Students: Students | null };

export type TCreateUser = Omit<Users, 'id' | 'created_at' | 'updated_at'>;
export type TUpdateUser = Partial<
  Omit<Users, 'id' | 'password' | 'created_at' | 'updated_at'>
>;

export interface IUserRepository {
  find(data: TUserIndexes): Promise<TUsers | null>;

  create(data: TCreateUser): Promise<Users>;

  exists(data: TUserIndexes): Promise<boolean>;

  update(id: string, data: TUpdateUser): Promise<void>;

  updatePassword(id: string, password: string): Promise<void>;
}
