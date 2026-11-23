import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const employees = [
  { username: 'budi', name: 'Budi Santoso', dateOfBirth: '1992-04-15', position: 'Software Engineer' },
  { username: 'siti', name: 'Siti Rahmawati', dateOfBirth: '1995-09-02', position: 'Product Designer' },
  { username: 'andi', name: 'Andi Pratama', dateOfBirth: '1988-12-20', position: 'Finance Staff' },
];

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: Role.HR_ADMIN,
    },
  });

  const employeePasswordHash = await bcrypt.hash('password123', 10);
  for (const e of employees) {
    await prisma.user.upsert({
      where: { username: e.username },
      update: {},
      create: {
        username: e.username,
        passwordHash: employeePasswordHash,
        role: Role.EMPLOYEE,
        employee: {
          create: {
            name: e.name,
            dateOfBirth: new Date(e.dateOfBirth),
            position: e.position,
          },
        },
      },
    });
  }

  console.log('Seeded: 1 HR admin, %d employees', employees.length);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
