import { NgModule } from '@angular/core';
import { DateMaskDirective } from './directives/ngDateMask.directive';

@NgModule({
  declarations: [DateMaskDirective],
  exports: [DateMaskDirective]
})
export class NgDateMaskModule {}
