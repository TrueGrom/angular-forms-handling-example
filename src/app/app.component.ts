import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from './core/services/form/form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formService: FormService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formService.getLoginForm();
  }

  onSubmit(): void {

  }
}
