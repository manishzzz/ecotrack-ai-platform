const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,128}$/;

export function isStrongPassword(password: string) {
  return passwordPattern.test(password);
}
