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

export { toDateOnly, calculateAge };
