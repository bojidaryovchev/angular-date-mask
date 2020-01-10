import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Format } from '../enums/format.enum';

@Directive({ selector: '[ngDateMask]', host: { '(keydown)': 'onKeyDown($event)', '(input)': 'onInput($event)' } })
export class DateMaskDirective implements OnInit {
  private readonly backspace: string = 'Backspace';
  private readonly arrowLeft: string = 'ArrowLeft';
  private readonly arrowRight: string = 'ArrowRight';
  private readonly home: string = 'Home';
  private readonly end: string = 'End';

  @Input() format: string;
  @Input() separator: string;

  validatorByIndex: { [key: number]: Function; } = {};
  formatLengthByIndex: { [key: number]: number; } = {};

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.formats.forEach((f, i) => {
      let validator: Function;

      switch (f) {
        case Format.Day:
          validator = this.dayValidator;

          break;
        case Format.Month:
          validator = this.monthValidator;

          break;
        case Format.Year:
          validator = this.yearValidator;

          break;
      }

      const position: number = this.format.indexOf(f);

      for (let index = position; index < position + f.length; index++) {
        this.validatorByIndex[index] = validator;
        this.formatLengthByIndex[index] = f.length;
      }
    });
  }

  get input(): HTMLInputElement {
    return this.elementRef.nativeElement;
  }

  get formats(): string[] {
    return this.format.split(this.separator);
  }

  get length(): number {
    return this.formats.reduce((p, c) => p + c.length, 0) + this.formats.length - 1;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === this.arrowLeft || event.key === this.arrowRight || event.key === this.home || event.key === this.end) {
      return;
    }

    const target: HTMLInputElement = event.target as HTMLInputElement;
    const index: number = target.selectionStart;

    if ((!/^\d$/g.test(event.key) || index === this.length) && event.key !== this.backspace) {
      return false;
    }

    let separatorExistsAfterwards: boolean = !!this.input.value.split('').filter((_, i) => i >= index).find(i => i === this.separator);

    if (event.key === this.backspace && !this.validatorByIndex[index - 2] && !separatorExistsAfterwards) {
      const inputValueArray: string[] = this.input.value.split('');

      inputValueArray.pop();
      inputValueArray.pop();

      this.input.value = inputValueArray.join('');
    }

    if (event.key === this.backspace) {
      if (!this.input.value[index - 1]) {
        return false;
      }

      if (separatorExistsAfterwards && this.input.value[index - 1] === this.separator) {
        return false;
      }

      return;
    }

    let prevLength: number = 0;

    for (let ix: number = index - 1; this.input.value[ix] !== this.separator && ix >= 0; ix--) {
      prevLength++;
    }

    if (this.input.value[index] === this.separator && prevLength === this.formatLengthByIndex[index - 1]) {
      return false;
    }

    const validator: Function = this.validatorByIndex[index];
    const validatorStringArray: string[] = [event.key];

    let validatorPosition: number = 0;
    let currentIndex: number = index;

    while (this.input.value[currentIndex - 1] !== this.separator && currentIndex - 1 >= 0) {
      validatorStringArray.unshift(this.input.value[--currentIndex]);
      validatorPosition++;
    }

    if (!validator(validatorStringArray.join(''), validatorPosition)) {
      return false;
    }

    if (this.input.value[index + 1] && this.input.value[index] !== this.separator || (this.input.value[index] && index == this.length - 1)) {
      let inputValueArray = this.input.value.split('');

      for (let i = 0; i < inputValueArray.length; i++) {
        if (i === index) {
          inputValueArray[i] = event.key;

          for (let current = i + 1; this.input.value[current] !== this.separator && current < this.length; current++) {
            inputValueArray[current] = undefined;
          }
        }
      }

      this.input.value = inputValueArray.filter(i => i).join('');

      this.setCaretPosition(this.input, index + 1);

      return false;
    }

    if (this.input.value[index] && index + 1 === this.length) {
      return false;
    }
  }

  onInput(event: KeyboardEvent) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const index: number = target.selectionStart;
    const isBeforeEnd: boolean = index < this.length;

    if (!this.validatorByIndex[index] && isBeforeEnd && this.input.value.length < this.length) {
      this.input.value += this.separator;
    }
  }

  private monthValidator(string: string, position: number): boolean {
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
  }

  private dayValidator(string: string, position: number): boolean {
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
  }

  private yearValidator(string: string, position: number): boolean {
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
  }

  private setCaretPosition(ctrl, pos: number) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(pos, pos);
    
    // IE8 and below
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange();

      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
}

/*

MM/dd/yyyy

*/
