export function monthValidator(string: string, position: number): boolean {
  if (position === 0) {
    if (+string > 1) {
      return false;
    }
  }

  if (position === 1) {
    if (+string[position - 1] === 0) {
      if (+string[position] === 0) {
        return false;
      }
    }

    if (+string[position - 1] === 1) {
      if (+string[position] > 2) {
        return false;
      }
    }
  }

  return true;
};
