import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Auth } from '../../shared/services/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styles: ``
})
export class Login {
  form: any;
  isSubmitted: boolean = false;

  constructor(public formBuilder: FormBuilder,
    private service: Auth,
    private router: Router,
    private toaster: ToastrService) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe({
        next: (res: any) => {
          if (res?.status === true && res?.data.accessToken) {
            localStorage.setItem('token', res.data.accessToken);
            this.router.navigateByUrl('/dashboard');
          } else {
            this.toaster.error(res?.message ?? 'Incorrect email or password', 'Login failed');
          }
        },
        error: (err: any) => {
          if (err.error && err.error.errors)
            this.toaster.error('Incorrect email or password', 'Login failed')
          else
            console.log('error during login:\n', err);
        }
      })
    }
  }
}
