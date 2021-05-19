import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  token: string;
  form: FormGroup;
  loading = false;
  submitted = false;
  isValid = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];

    this.form = this.formBuilder.group({
      password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.updatePassword(true);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.updatePassword();
  }

  updatePassword(validate: boolean = false) {
    this.authService.updatePassword(this.token, this.f.password.value, validate)
      .pipe(first())
      .subscribe(
        data => {
          if (validate) {
            this.isValid = true;
            this.f['password'].enable();
            this.f['confirmPassword'].enable();
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}