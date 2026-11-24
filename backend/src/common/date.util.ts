const APP_TIMEZONE = 'Asia/Jakarta';

const appDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: APP_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function calculateAge(dateOfBirth: Date, today: Date = new Date()): number {
  let age = today.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const birthdayPassed =
    today.getUTCMonth() > dateOfBirth.getUTCMonth() ||
    (today.getUTCMonth() === dateOfBirth.getUTCMonth() &&
      today.getUTCDate() >= dateOfBirth.getUTCDate());
  if (!birthdayPassed) {
    age -= 1;
  }
  return age;
}

function workDateFor(instant: Date): Date {
  return new Date(`${appDateFormatter.format(instant)}T00:00:00.000Z`);
}

export { APP_TIMEZONE, toDateOnly, calculateAge, workDateFor };
