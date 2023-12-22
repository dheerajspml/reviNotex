
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function seed() {
  const dheeraj = await prisma.user.create({
    data: {
      username: 'dk08',
      email: 'dheeraj08@gmail.com',
      passwordHash:
        '$2b$10$DHl9SpDzdfXFKzvDPxHuJeU1w9UEY52gNHft33zoKOHxuohz4ARW2',
    },
  });
  const subject1 = await prisma.subject.create({
    data: {
      name: 'History',
      userId: dheeraj.id,
    },
  });
  const folder1 = await prisma.folder.create({
    data: {
      name: 'Ancient History',
      subjectId: subject1.id,
    },
  });
  const notes1 = [
    {
      userId: dheeraj.id,
      folderId: folder1.id,
      title: 'Note 1',
      keyword: 'Key 1',
      content: 'This is the first note',
    },
    {
      userId: dheeraj.id,
      folderId: folder1.id,
      title: 'Note 2',
      keyword: 'Key 2',
      content: 'This is the second note',
    },
  ];
  
  for (const notedata of notes1){
    await prisma.note.create({
      data: notedata ,
    });
  }
  
  // You can repeat similar steps for additional subjects, folders, and notes
  console.log('Seed data successfully created.');
}
seed();