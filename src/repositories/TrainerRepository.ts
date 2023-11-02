import prisma from '@src/config/client';
import { InternalServerError } from '@src/domain/HttpErrors';
import { TrainerAlreadyExistsException } from '@src/domain/TrainerExceptions';
import { uuidType } from '@src/schemas/Generic';

export default class TrainerRepository {
  static insertTrainer(user_id: uuidType): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const findTrainer = await prisma.trainers.findUnique({
          where: { user_id }
        });

        if (findTrainer) {
          return reject(new TrainerAlreadyExistsException());
        }

        await prisma.trainers.create({ data: { user_id } });

        resolve();
      } catch (error) {
        return reject(new InternalServerError());
      }
    });
  }
}
