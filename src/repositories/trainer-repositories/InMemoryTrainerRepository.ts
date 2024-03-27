import { Students, Trainer_Students, Trainers, Users } from '@prisma/client';
import {
  StudentAlreadyAssignedException,
  StudentNotFoundException
} from '@src/domain/StudentExceptions';
import {
  TrainerAlreadyExistsException,
  TrainerNotFoundException
} from '@src/domain/TrainerExceptions';
import { randomUUID } from 'crypto';
import { ITrainerRepository, UsersWithStudent } from './TrainerRepository';
import { UserNotFoundException } from '@src/domain/UserExceptions';

export type UsersAndStudentsRelation = Users & {
  Students:
    | (Students & {
        Trainers_Students: Trainer_Students | null;
      })
    | null;
};

export default class InMemoryTrainerRepository implements ITrainerRepository {
  public trainers: Trainers[] = [];
  public students: Students[] = [];
  public trainersXStudents: Trainer_Students[] = [];
  public users: UsersAndStudentsRelation[] = [];

  async find(trainer_id: string): Promise<Trainers | null> {
    return (
      this.trainers.find((trainer) => trainer.trainer_id === trainer_id) || null
    );
  }

  async exists(trainer_id: string): Promise<boolean> {
    return !!this.trainers.find((trainer) => trainer.trainer_id === trainer_id);
  }

  async create(user_id: string): Promise<Trainers> {
    const findUser = this.users.find((user) => user.id === user_id);

    if (!findUser) {
      throw new UserNotFoundException();
    }

    const trainerAlreadyExists = this.trainers.find(
      (trainer) => trainer.user_id === user_id
    );

    if (trainerAlreadyExists) {
      throw new TrainerAlreadyExistsException();
    }

    const trainer: Trainers = {
      trainer_id: randomUUID(),
      user_id
    };

    this.trainers.push(trainer);

    return trainer;
  }

  async assignStudent(
    trainer_id: string,
    student_id: string
  ): Promise<Trainer_Students> {
    const findTrainer = this.trainers.find(
      (trainer) => trainer.trainer_id === trainer_id
    );
    const findStudent = this.students.find(
      (student) => student.student_id === student_id
    );

    if (!findTrainer) {
      throw new TrainerNotFoundException();
    }

    if (!findStudent) {
      throw new StudentNotFoundException();
    }

    const trainersXStudentAlreadyExists = this.trainersXStudents.find(
      (trainerXStudent) =>
        trainerXStudent.student_id === student_id &&
        trainerXStudent.trainer_id === trainer_id
    );

    if (trainersXStudentAlreadyExists) {
      throw new StudentAlreadyAssignedException();
    }

    const trainersXStudent: Trainer_Students = {
      id: randomUUID(),
      student_id,
      trainer_id,
      created_at: new Date()
    };

    this.trainersXStudents.push(trainersXStudent);

    return trainersXStudent;
  }

  async getStudents(trainer_id: string): Promise<UsersWithStudent[]> {
    const trainer = this.trainers.find(
      (trainer) => trainer.trainer_id === trainer_id
    );

    if (!trainer) {
      throw new TrainerNotFoundException();
    }

    const trainerXStudents = this.users.filter((user) => {
      return (
        user.Students &&
        user.Students.Trainers_Students &&
        user.Students.Trainers_Students.trainer_id === trainer_id
      );
    });

    const parsedUsers: UsersWithStudent[] = trainerXStudents.map((user) => {
      const { Students, ...restUser } = user;
      return {
        ...restUser,
        student_id: Students!.student_id
      };
    });

    return parsedUsers;
  }
}
