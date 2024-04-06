import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSeed() {
  console.log('[SEED]: Starting test...');

  // password = AAAAAAbb!1
  const hashedPassword =
    '$2b$10$UVt.9PHT8OVbj2nZNoRrLuVFTz6C.SKkmcrq1DfochMlCcRuO1Mm2';

  console.log('[SEED]: Inserting users');
  const users = await Promise.all([
    prisma.users.create({
      data: {
        email: 'brunobaronenrique@gmail.com',
        name: 'Bruno Enrique',
        document: '12345678912',
        password: hashedPassword
      }
    }),
    prisma.users.create({
      data: {
        email: 'lucasbegnini@gmail.com',
        name: 'Lucas Begnini',
        document: '12345678913',
        password: hashedPassword
      }
    })
  ]);

  console.log('[SEED]: All users inserted successfully');

  console.log('[SEED]: Inserting trainers');
  const trainers = await Promise.all([
    prisma.trainers.create({
      data: {
        user_id: users[0].id
      }
    })
  ]);
  console.log('[SEED]: All trainers inserted successfully');

  console.log('[SEED]: Inserting students');
  const students = await Promise.all([
    prisma.students.create({
      data: {
        user_id: users[1].id
      }
    })
  ]);

  console.log('[SEED]: All students inserted successfully');

  console.log('[SEED]: Assigning students to trainers');

  await Promise.all([
    prisma.trainer_Students.create({
      data: {
        trainer_id: trainers[0].trainer_id,
        student_id: students[0].student_id
      }
    })
  ]);

  console.log('[SEED]: Inserting exercises');
  await prisma.exercises.createMany({
    data: [
      {
        name: 'Supino reto',
        description: 'Supino reto exercício para peito',
        trainer_id: trainers[0].trainer_id,
        video_url:
          'https://www.youtube.com/watch?v=sqOw2Y6uDWQ&pp=ygUTc3VwaW5vIHJldG8gbGVhbmRybw%3D%3D'
      },
      {
        name: 'Supino inclinado',
        description: 'Supino inclinado exercício para peito',
        trainer_id: trainers[0].trainer_id,
        video_url:
          'https://www.youtube.com/watch?v=WP1VLAt8hbM&pp=ygUYc3VwaW5vIGluY2xpbmFkbyBsZWFuZHJv'
      }
    ]
  });
  console.log('[SEED]: All exercises inserted successfully');
}

if (process.env.NODE_ENV === 'test') {
  testSeed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(`[SEED][ERROR] - ${e}`);
      await prisma.$disconnect();
    });
}
