export function dayValidator(string: string, position: number): boolean {
  if (position === 0) {
    if (+string > 3) {
      return false;
    }
  }

  if (position === 1) {
    if (+string[position - 1] === 0) {
      if (+string[position] === 0) {
        return false;
      }
    }

    if (+string[position - 1] === 3) {
      if (+string[position] > 1) {
        return false;
      }
    }
  }

  return true;
};
