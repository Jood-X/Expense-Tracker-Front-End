import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../shared/services/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmemail',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './confirmemail.html',
  styles: ``
})
export class Confirmemail {
  form: any;
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private service: Auth,
    private router: Router,
    private toaster: ToastrService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const email = navigation?.extras.state?.['email'];

    this.form = this.formBuilder.group({
      email: [email, Validators.required],
      code: ['', Validators.required],
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
      this.service.confirmEmail(this.form.value).subscribe({
        next: (res: any) => {
          if (res?.status === true && res?.data) {
            this.router.navigateByUrl('/signin');
          } else {
            this.toaster.error(res?.message ?? 'Incorrect email or code', 'Confirmation failed');
          }
        },
        error: (err: any) => {
          if (err.error && err.error.errors)
            this.toaster.error('Incorrect email or code', 'Confirmation failed')
          else
            console.log('error during confirmation:\n', err);
        }
      })
    }
  }
}
