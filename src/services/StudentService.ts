import { TrainerNotFoundException } from '@src/domain/TrainerExceptions';
import { IStudentRepository } from '@src/repositories/student-repositories/StudentRepository';
import { IUserRepository } from '@src/repositories/user-repositories/UserRepository';

export default class StudentService {
  constructor(
    private studentRepository: IStudentRepository,
    private userRepository: IUserRepository
  ) {}

  async insert(user_id: string): Promise<void> {
    try {
      const findUser = await this.userRepository.find({ id: user_id });

      if (!findUser || !findUser.Trainers) {
        throw new TrainerNotFoundException();
      }

      await this.studentRepository.create(findUser.id);
    } catch (error) {
      throw error;
    }
  }
}
