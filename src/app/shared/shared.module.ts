import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputErrorComponent } from './components/input-error/input-error.component';
import { FormErrorsDirective } from './directives/form-errors/form-errors.directive';
import { FormSubmitDirective } from './directives/form-submit/form-submit.directive';

@NgModule({
  declarations: [FormErrorsDirective, FormSubmitDirective, InputErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormErrorsDirective,
    FormSubmitDirective
  ],
  entryComponents: [InputErrorComponent]
})
export class SharedModule {
}
