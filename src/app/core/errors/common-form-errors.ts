import { InjectionToken } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

type GetErrorFunction = (error?: ValidationErrors) => string;

export interface CommonFormErrors {
  [key: string]: GetErrorFunction;
}

export const commonFormErrors: Readonly<CommonFormErrors> = Object.freeze({
  required: () => 'This field is required',
  email: () => 'Invalid email',
  minlength: (error: ValidationErrors) => `Password must be at least ${error.requiredLength} characters long`,
  maxlength: (error: ValidationErrors) => `password must be no more than ${error.requiredLength} characters`,
  passwordRequiredDigit: () => 'Password must contain at least one digit',
  passwordRequiredLatinLetter: () => 'Password must contain at least one latin letter'
});

export const COMMON_FORM_ERRORS = new InjectionToken<CommonFormErrors>('app.formErrors', {
  providedIn: 'root',
  factory: (): CommonFormErrors => commonFormErrors
});
