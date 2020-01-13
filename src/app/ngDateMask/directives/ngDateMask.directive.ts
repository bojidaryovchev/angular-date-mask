import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Format } from '../enums/format.enum';
import { dayValidator } from '../validators/day.validator';
import { monthValidator } from '../validators/month.validator';
import { yearValidator } from '../validators/year.validator';

@Directive({ selector: '[ngDateMask]', host: { '(keydown)': 'onKeyDown($event)', '(input)': 'onInput($event)', '(mousedown)': 'onMouseDown($event)' } })
export class DateMaskDirective implements OnInit {
  private readonly backspace: string = 'Backspace';
  private readonly arrowLeft: string = 'ArrowLeft';
  private readonly arrowRight: string = 'ArrowRight';
  private readonly home: string = 'Home';
  private readonly end: string = 'End';
  private readonly tab: string = 'Tab';
  private readonly f5: string = 'F5';

  @Input() format: string;
  @Input() separator: string;

  validatorByIndex: { [key: number]: Function } = {};
  formatLengthByIndex: { [key: number]: number } = {};

  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.formats.forEach((f, i) => {
      let validator: Function;

      switch (f) {
        case Format.Day:
          validator = dayValidator;

          break;
        case Format.Month:
          validator = monthValidator;

          break;
        case Format.Year:
          validator = yearValidator;

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
    if (event.key === this.arrowLeft || event.key === this.arrowRight || event.key === this.home || event.key === this.end || event.key == this.f5) {
      return;
    }

    const target: HTMLInputElement = event.target as HTMLInputElement;
    const index: number = target.selectionStart;

    if (event.key === this.tab) {
      const separatorIndex: number = this.input.value.indexOf(this.separator);

      if (separatorIndex !== -1) {
        const nextSeparatorIndex: number = this.input.value.lastIndexOf(this.separator);

        if (separatorIndex !== nextSeparatorIndex) {
          if (index <= separatorIndex) {
            this.setCaretSelection(this.input, separatorIndex + 1, nextSeparatorIndex);
          } else if (index > nextSeparatorIndex) {
            this.setCaretSelection(this.input, 0, separatorIndex);
            
          } else {
            this.setCaretSelection(this.input, nextSeparatorIndex + 1, this.input.value.length);
          }
        } else {
          if (index >= separatorIndex) {
            this.setCaretSelection(this.input, 0, separatorIndex);
          } else {
            this.setCaretSelection(this.input, separatorIndex + 1, this.input.value.length);
          }
        }
      }

      return false;
    }

    if (event.key !== this.backspace) {
      if (!this.isNumber(event.key) || index === this.length) {
        return false;
      }
    } else {
      if (!this.input.value[index - 1]) {
        return false;
      }

      const separatorExistsAfterwards: boolean = !!this.input.value
        .split('')
        .filter((_, i) => i >= index)
        .find(i => i === this.separator);

      if (separatorExistsAfterwards) {
        if (this.input.value[index - 1] === this.separator) {
          return false;
        }
      } else {
        if (this.input.value[index - 2] === this.separator) {
          this.removeLast(2 + this.input.value.length - index);

          return false;
        }
      }

      return;
    }

    const delta: number = this.delta(index);

    const validator: Function = this.validatorByIndex[index + delta];
    const validatorStringArray: string[] = [event.key];

    let validatorPosition: number = 0;
    let currentIndex: number = index;

    while (this.input.value[currentIndex - 1] !== this.separator && currentIndex - 1 >= 0) {
      validatorStringArray.unshift(this.input.value[--currentIndex]);
      validatorPosition++;
    }

    if (!validator) {
      return false;
    }

    if (!validator(validatorStringArray.join(''), validatorPosition)) {
      return false;
    }

    if ((this.input.value[index + 1] && this.input.value[index] !== this.separator) || (this.input.value[index] && index + delta == this.length - 1)) {
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

    const formatLength = this.formatLength(index);

    if (formatLength === this.formatLengthByIndex[index + delta]) {
      return false;
    }
  }

  onMouseDown() {
    return false;
  }

  onInput(event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const index: number = target.selectionStart;
    const delta: number = this.delta(index);
    const isBeforeEnd: boolean = index + delta < this.length;

    if (!this.validatorByIndex[index + delta] && isBeforeEnd && this.input.value.length < this.length && event.inputType !== 'deleteContentBackward') {
      this.input.value += this.separator;
    }
  }

  private isNumber(number: string): boolean {
    return /^\d$/g.test(number);
  }

  private removeLast(count: number) {
    const inputValueArray: string[] = this.input.value.split('');

    for (let index = 0; index < count; index++) {
      inputValueArray.pop();
    }

    this.input.value = inputValueArray.join('');
  }

  private formatLength(index: number) {
    let formatLength: number = 0;

    for (let ix: number = index - 1; this.input.value[ix] && this.input.value[ix] !== this.separator && ix >= 0; ix--) {
      formatLength++;
    }

    for (let ix: number = index; this.input.value[ix] && this.input.value[ix] !== this.separator && ix < this.length; ix++) {
      formatLength++;
    }

    return formatLength;
  }

  private delta(index: number): number {
    let delta: number = 0;

    if (this.input.value) {
      let previousSeparators: string[] = this.input.value
        .split('')
        .filter((_, i) => i < index)
        .filter(i => i === this.separator);

      let separatorsCount: number = previousSeparators.length;
      let subdelta: number = 0;

      if (this.input.value[index] === this.separator) {
        separatorsCount++;
        subdelta++;
      }

      if (separatorsCount === 2) {
        const inputLastIndex = this.input.value.lastIndexOf(this.separator);
        const formatLastIndex = this.format.lastIndexOf(this.separator);

        delta = this.format.substring(0, formatLastIndex).length - this.input.value.substring(0, inputLastIndex).length - subdelta;
      } else if (separatorsCount === 1) {
        const inputIndex = this.input.value.indexOf(this.separator);
        const formatIndex = this.format.indexOf(this.separator);

        delta = this.format.substring(0, formatIndex).length - this.input.value.substring(0, inputIndex).length - subdelta;
      }
    }

    return delta;
  }

  private setCaretPosition(ctrl, pos: number) {
    this.setCaretSelection(ctrl, pos, pos);
  }

  private setCaretSelection(ctrl, start: number, end: number) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(start, end);

      // IE8 and below
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange();

      range.collapse(true);
      range.moveEnd('character', start);
      range.moveStart('character', end);
      range.select();
    }
  }
}
