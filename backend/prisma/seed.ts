import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AttendanceType,
  PrismaClient,
  Role,
} from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const employees = [
  {
    username: 'giorno',
    name: 'Giorno Giovanna',
    dateOfBirth: '1992-04-15',
    position: 'Software Engineer',
  },
  {
    username: 'diego',
    name: 'Diego Brando',
    dateOfBirth: '1995-09-02',
    position: 'Product Designer',
  },
  {
    username: 'johnny',
    name: 'Johnny Joestar',
    dateOfBirth: '1988-12-20',
    position: 'Finance Staff',
  },
];

const SAMPLE_DAYS = 5;
const JAKARTA_UTC_OFFSET_HOURS = 7;

function placeholderPhoto(
  label: string,
  time: string,
  color: string,
): Uint8Array<ArrayBuffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect width="640" height="480" fill="${color}"/><circle cx="320" cy="200" r="80" fill="#ffffff" fill-opacity="0.85"/><rect x="200" y="300" width="240" height="120" rx="60" fill="#ffffff" fill-opacity="0.85"/><text x="24" y="48" font-family="sans-serif" font-size="28" fill="#ffffff">${label}</text><text x="24" y="456" font-family="sans-serif" font-size="24" fill="#ffffff">${time}</text></svg>`;
  return new TextEncoder().encode(svg);
}

function recentWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  while (days.length < count) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      days.push(new Date(cursor));
    }
  }
  return days;
}

function atJakartaTime(day: Date, hour: number, minute: number): Date {
  const date = new Date(day);
  date.setUTCHours(hour - JAKARTA_UTC_OFFSET_HOURS, minute, 0, 0);
  return date;
}

async function seedSampleAttendance(
  employeeId: number,
  name: string,
  seed: number,
) {
  const existing = await prisma.attendance.count({ where: { employeeId } });
  if (existing > 0) {
    return 0;
  }

  const records = recentWeekdays(SAMPLE_DAYS).flatMap((day, index) => {
    const inMinute = (seed * 7 + index * 11) % 30;
    const outMinute = (seed * 5 + index * 13) % 45;
    const clockIn = atJakartaTime(day, 8, inMinute);
    const clockOut = atJakartaTime(day, 17, outMinute);
    const dayLabel = day.toISOString().slice(0, 10);
    return [
      {
        employeeId,
        type: AttendanceType.CLOCK_IN,
        recordedAt: clockIn,
        photo: placeholderPhoto(
          `${name} · Clock In`,
          `${dayLabel} 08:${String(inMinute).padStart(2, '0')} WIB`,
          '#e5484d',
        ),
        photoMimeType: 'image/svg+xml',
      },
      {
        employeeId,
        type: AttendanceType.CLOCK_OUT,
        recordedAt: clockOut,
        photo: placeholderPhoto(
          `${name} · Clock Out`,
          `${dayLabel} 17:${String(outMinute).padStart(2, '0')} WIB`,
          '#c53035',
        ),
        photoMimeType: 'image/svg+xml',
      },
    ];
  });

  await prisma.attendance.createMany({ data: records });
  return records.length;
}

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
  let attendanceCount = 0;
  for (const [index, e] of employees.entries()) {
    const user = await prisma.user.upsert({
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
    if (user.employeeId !== null) {
      attendanceCount += await seedSampleAttendance(
        user.employeeId,
        e.name,
        index + 1,
      );
    }
  }

  console.log(
    'Seeded: 1 HR admin, %d employees, %d sample attendance records',
    employees.length,
    attendanceCount,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
