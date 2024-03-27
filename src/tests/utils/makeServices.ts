import InMemoryUserRepository from '@src/repositories/user-repositories/InMemoryUserRepository';
import { UserService } from '@src/services/UserService';

export function makeUserService(): {
  inMemoryUserRepository: InMemoryUserRepository;
  userService: UserService;
} {
  const inMemoryUserRepository = new InMemoryUserRepository();
  const userService = new UserService(inMemoryUserRepository);
  return {
    inMemoryUserRepository,
    userService
  };
}
