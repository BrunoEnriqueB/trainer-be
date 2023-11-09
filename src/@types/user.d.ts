import { Students, Trainers, Users } from '@prisma/client';

export type TrainerAndStudentsNull = {
  Trainers: Trainers | null;
  Students: Students | null;
};

export type publicUser = {
  id: string;
  name: string;
  document: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type publicUserAndForeigns = publicUser & TrainerAndStudentsNull;

export type userData = {
  document: string;
  email: string;
};

export type User = Users & {
  isTrainer: boolean;
  isStudent: boolean;
};

export type userIndexes =
  | {
      email: string;
    }
  | {
      document: string;
    }
  | {
      id: string;
    };
