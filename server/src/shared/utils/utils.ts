export function calculateAge(birthDate: Date): string {
  const now = new Date();
  let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
  let months = now.getUTCMonth() - birthDate.getUTCMonth();
  const days = now.getUTCDate() - birthDate.getUTCDate();

  if (days < 0) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years ${months} months`;
}
