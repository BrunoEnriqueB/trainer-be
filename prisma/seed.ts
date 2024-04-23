import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSeed() {
  console.log('[SEED]: Starting test...');

  // password = AAAAAAbb!1
  const hashedPassword =
    '$2b$10$UVt.9PHT8OVbj2nZNoRrLuVFTz6C.SKkmcrq1DfochMlCcRuO1Mm2';

  console.log('[SEED]: Inserting users');

  const trainersData = [
    {
      id: '908f263a-1321-44de-8547-db875c38761e',
      email: 'brunobaronenrique@gmail.com',
      name: 'Bruno Enrique',
      document: '12345678912',
      password: hashedPassword
    },
    {
      id: '64226690-d693-4f94-9eae-931b33465e75',
      email: 'treinador1@gmail.com',
      name: 'Treinador A',
      document: '12345678914',
      password: hashedPassword
    },
    {
      id: '1de4f22c-b906-45c4-87be-194c6c96289d',
      email: 'treinador2@gmail.com',
      name: 'Treinador B',
      document: '12345678915',
      password: hashedPassword
    }
  ];
  const studentsData = [
    {
      id: 'f2bf29f5-2cfe-435c-8f27-f25438555bc1',
      email: 'lucasbegnini@gmail.com',
      name: 'Lucas Begnini',
      document: '12345678913',
      password: hashedPassword
    },
    {
      id: '293a47c7-d67c-4710-8a8a-b116e79c686f',
      email: 'estudante1@gmail.com',
      name: 'Estudante A',
      document: '12345678916',
      password: hashedPassword
    },
    {
      id: '4b2935a0-9978-4ff9-8d7f-a9643619c4e6',
      email: 'estudante2@gmail.com',
      name: 'Estudante1 B',
      document: '12345678917',
      password: hashedPassword
    }
  ];

  const users = await prisma.users.createMany({
    data: [...trainersData, ...studentsData]
  });

  console.log('[SEED]: All users inserted successfully');

  console.log('[SEED]: Inserting trainers');
  const trainers = await Promise.all([
    prisma.trainers.create({
      data: {
        user_id: trainersData[0].id
      }
    }),
    prisma.trainers.create({
      data: {
        user_id: trainersData[1].id
      }
    }),
    prisma.trainers.create({
      data: {
        user_id: trainersData[2].id
      }
    })
  ]);
  console.log('[SEED]: All trainers inserted successfully');

  console.log('[SEED]: Inserting students');
  const students = await Promise.all([
    prisma.students.create({
      data: {
        user_id: studentsData[0].id
      }
    }),
    prisma.students.create({
      data: {
        user_id: studentsData[1].id
      }
    }),
    prisma.students.create({
      data: {
        user_id: studentsData[2].id
      }
    })
  ]);

  console.log('[SEED]: All students inserted successfully');

  console.log('[SEED]: Assigning students to trainers');

  await prisma.trainer_Students.createMany({
    data: [
      {
        trainer_id: trainers[0].trainer_id,
        student_id: students[0].student_id
      },
      {
        trainer_id: trainers[1].trainer_id,
        student_id: students[1].student_id
      },
      {
        trainer_id: trainers[2].trainer_id,
        student_id: students[2].student_id
      }
    ]
  });

  const exercises = [
    {
      name: 'Supino reto Bruno Enrique',
      description: 'Supino reto exercício para peito',
      trainer_id: trainers[0].trainer_id,
      video_url:
        'https://www.youtube.com/watch?v=sqOw2Y6uDWQ&pp=ygUTc3VwaW5vIHJldG8gbGVhbmRybw%3D%3D'
    },
    {
      name: 'Supino inclinado Bruno Enrique',
      description: 'Supino inclinado exercício para peito',
      trainer_id: trainers[0].trainer_id,
      video_url:
        'https://www.youtube.com/watch?v=WP1VLAt8hbM&pp=ygUYc3VwaW5vIGluY2xpbmFkbyBsZWFuZHJv'
    },
    {
      name: 'Supino reto Treinador A',
      description: 'Supino reto exercício para peito',
      trainer_id: trainers[1].trainer_id,
      video_url:
        'https://www.youtube.com/watch?v=sqOw2Y6uDWQ&pp=ygUTc3VwaW5vIHJldG8gbGVhbmRybw%3D%3D'
    },
    {
      name: 'Supino inclinado Treinador B',
      description: 'Supino inclinado exercício para peito',
      trainer_id: trainers[2].trainer_id,
      video_url:
        'https://www.youtube.com/watch?v=WP1VLAt8hbM&pp=ygUYc3VwaW5vIGluY2xpbmFkbyBsZWFuZHJv'
    }
  ];

  console.log('[SEED]: Inserting exercises');
  await prisma.exercises.createMany({
    data: exercises
  });
  console.log('[SEED]: All exercises inserted successfully');

  console.log('[SEED]: Inserting workouts');

  const workotus = [
    {
      name: 'Treino A (Superiores)',
      description: 'Esse treino tem como foco partes superiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/kCSps1nPg6o/maxresdefault.jpg',
      trainer_id: trainers[0].trainer_id
    },
    {
      name: 'Treino B (Inferiores)',
      description: 'Esse treino tem como foco partes inferiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/rmz2FX2rdnY/maxresdefault.jpg',
      trainer_id: trainers[0].trainer_id
    },
    {
      name: 'Treino A (Superiores)',
      description: 'Esse treino tem como foco partes superiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/kCSps1nPg6o/maxresdefault.jpg',
      trainer_id: trainers[1].trainer_id
    },
    {
      name: 'Treino B (Inferiores)',
      description: 'Esse treino tem como foco partes inferiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/rmz2FX2rdnY/maxresdefault.jpg',
      trainer_id: trainers[1].trainer_id
    },
    {
      name: 'Treino A (Superiores)',
      description: 'Esse treino tem como foco partes superiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/kCSps1nPg6o/maxresdefault.jpg',
      trainer_id: trainers[2].trainer_id
    },
    {
      name: 'Treino B (Inferiores)',
      description: 'Esse treino tem como foco partes inferiores do corpo',
      logo_url: 'https://i.ytimg.com/vi/rmz2FX2rdnY/maxresdefault.jpg',
      trainer_id: trainers[2].trainer_id
    }
  ];

  await prisma.workouts.createMany({
    data: workotus
  });

  console.log('[SEED]: All workouts inserted successfully');
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
