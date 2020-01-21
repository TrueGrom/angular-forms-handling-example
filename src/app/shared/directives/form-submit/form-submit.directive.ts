import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { shareReplay, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appFormSubmit]'
})
export class FormSubmitDirective implements OnInit, OnDestroy {

  submit$: Observable<Event>;

  private unsub$ = new Subject();

  constructor(
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    this.submit$ = fromEvent<Event>(this.elementRef.nativeElement, 'submit')
      .pipe(
        shareReplay(1),
        takeUntil(this.unsub$)
      );
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
