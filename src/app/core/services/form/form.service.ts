import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private fb: FormBuilder
  ) {
  }

  getLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }, { updateOn: 'blur' }],
      password: ['', { validators: [Validators.required, this.passwordValidator()] }, { updateOn: 'blur' }]
    }, { updateOn: 'blur' });
  }

  private passwordValidator(): ValidatorFn | null {
    return Validators.compose([
      Validators.minLength(8),
      this.patternValidator(/\d+/, { passwordRequiredDigit: true }),
      this.patternValidator(/[a-zA-Z]+/, { passwordRequiredLatinLetter: true }),
    ]);
  }

  private patternValidator(regexp: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      return regexp.test(control.value) ? null : error;
    };
  }
}
