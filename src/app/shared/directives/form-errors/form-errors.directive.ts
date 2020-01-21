import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Host,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { COMMON_FORM_ERRORS, CommonFormErrors } from '@core/errors/common-form-errors';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { FormSubmitDirective } from '@shared/directives/form-submit/form-submit.directive';
import { EMPTY, fromEvent, merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appFormErrors]'
})
export class FormErrorsDirective implements OnDestroy, OnInit {
  @Input() errorClass: string;

  submit$: Observable<Event>;

  private unsub$ = new Subject();

  private componentRef: ComponentRef<InputErrorComponent> | null;

  constructor(
    @Optional() @Host() private form: FormSubmitDirective,
    @Inject(COMMON_FORM_ERRORS) private errors: CommonFormErrors,
    private control: NgControl,
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer2: Renderer2,
    private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    this.submit$ = this.form ? this.form.submit$ : EMPTY;
    this.listenControlValuesChanges();
    this.listenFocus();
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
    this.destroyErrorView();
  }

  private createErrorView(error: string): void {
    if (this.componentRef && this.componentRef.instance.error === error) {
      return;
    }
    this.destroyErrorView();
    const factory = this.componentFactoryResolver.resolveComponentFactory(InputErrorComponent);
    this.componentRef = this.viewContainer.createComponent(factory);
    this.componentRef.instance.error = error;
    this.cdr.markForCheck();
  }

  private destroyErrorView(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.viewContainer.clear();
    this.cdr.markForCheck();
  }

  private handleControlError(controlErrors: ValidationErrors): void {
    const firstErrorKey = Object.keys(controlErrors)[0];
    const getError = this.errors[firstErrorKey];
    const error = getError(controlErrors[firstErrorKey]);
    this.createErrorView(error);
    this.addErrorClass();
  }

  private handleValidControl(): void {
    this.destroyErrorView();
    this.removeErrorClass();
  }

  private listenControlValuesChanges(): void {
    if (this.control && this.control.valueChanges) {
      merge(
        this.submit$,
        this.control.valueChanges
      ).pipe(
        takeUntil(this.unsub$)
      ).subscribe(() => {
        const controlErrors = this.control.errors;
        if (controlErrors) {
          this.handleControlError(controlErrors);
        } else {
          this.handleValidControl();
        }
      });
    }
  }

  private listenFocus(): void {
    fromEvent(this.elementRef.nativeElement, 'focus').pipe(
      takeUntil(this.unsub$)
    ).subscribe(() => this.handleValidControl());
  }

  private addErrorClass(): void {
    if (this.errorClass) {
      this.renderer2.addClass(this.elementRef.nativeElement, this.errorClass);
    }
  }

  private removeErrorClass(): void {
    if (this.errorClass) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this.errorClass);
    }
  }

}
