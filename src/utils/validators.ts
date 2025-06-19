export function validatePassword(password: string) {
  return /^[^ ]{8,}$/.test(password);
}
