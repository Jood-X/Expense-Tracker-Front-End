import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirstkeyPipe } from '../../shared/pipes/firstkey-pipe';
import { Auth } from '../../shared/services/auth';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstkeyPipe, RouterLink],
  templateUrl: './registration.html',
  styles: ``
})
export class Registration {
  form: any;

  constructor(public formBuilder: FormBuilder, private service: Auth, private toastr: ToastrService, private router: Router) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9])/)]],
      confirmPassword: [''],
    }, { validators: this.passwordMatchValidator });
  }
  isSubmitted: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value).subscribe({
        next: (res: any) => {
          if (res.status) {
            const email = this.form.value.email;
            console.log(email);
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success(res.message || 'User created successfully', 'Success');
            this.router.navigate(['/confirmemail'], { state: { email } });
          } else {
            if (res.error && res.error.errors) {
              Object.values(res.error.errors).forEach((fieldErrors: any) => {
                if (Array.isArray(fieldErrors)) {
                  fieldErrors.forEach((error: any) => {
                    switch (error.code) {
                      case 'DuplicateUserName':
                      case 'DuplicateEmail':
                        this.toastr.error('Email already exists', 'Error');
                        break;
                      default:
                        this.toastr.error(error.description || 'Error occurred', 'Error');
                        console.log(error);
                    }
                  });
                }
              });
            } else {
              this.toastr.error('Registration failed', 'Error');
              console.log('Unexpected response:', res);
            }
          }
        },
        error: (err: any) => {
          if (err.error && err.error.errors) {
            Object.values(err.error.errors).forEach((fieldErrors: any) => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((error: any) => {
                  switch (error.code) {
                    case 'DuplicateUserName':
                    case 'DuplicateEmail':
                      this.toastr.error('Email already exists', 'Error');
                      break;
                    default:
                      this.toastr.error(error.description || 'Validation error', 'Error');
                      console.log(error);
                  }
                });
              }
            });
          } else {
            console.log('error:', err);
            this.toastr.error('An unexpected error occurred', 'Error');
          }
        }
      });
    }
    console.log(this.form.value);
  }

  hasDisplayError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
  }
}
