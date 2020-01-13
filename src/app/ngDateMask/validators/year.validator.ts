export function yearValidator(string: string, position: number): boolean {
  if (position === 0) {
    if (+string < 1 || +string > 9) {
      return false;
    }
  }

  if (position === 1) {
    if (+string[position - 1] === 1) {
      if (+string[position] < 8) {
        return false;
      }
    }
  }

  if (position === 2) {
    if (+string[position - 2] === 1 && +string[position - 1] === 8) {
      if (+string[position] < 9) {
        return false;
      }
    }
  }

  if (position === 3) {
    if (+string[position - 3] === 1 && +string[position - 2] === 8 && +string[position - 1] === 9) {
      if (+string[position] < 5) {
        return false;
      }
    }
  }

  return true;
};
