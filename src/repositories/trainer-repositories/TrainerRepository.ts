import { Trainer_Students, Trainers, Users } from '@prisma/client';

export type UsersWithStudent = Users & {
  student_id: string;
};

export default interface ITrainerRepository {
  find(trainer_id: string): Promise<Trainers>;

  exists(trainer_id: string): Promise<boolean>;
  create(user_id: string): Promise<Trainers>;

  assignStudent(
    trainer_id: string,
    student_id: string
  ): Promise<Trainer_Students>;

  getStudents(trainer_id: string): Promise<UsersWithStudent>;
}
