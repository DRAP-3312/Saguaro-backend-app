export function relations<T>(array: T[], value: T, param: keyof T): boolean {
  let valid = false;
  array.forEach((x) => {
    if (x[param] === value[param]) {
      valid = !valid;
    }
  });
  return valid;
}
