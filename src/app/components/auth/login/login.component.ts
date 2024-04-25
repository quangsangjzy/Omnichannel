import { Component } from '@angular/core';
import { FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginserviceService } from '../loginservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginStatus: boolean | null = null;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginserviceService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.loginStatus = true;
    });
  }

  login(user_name: string, password: string): void {
    this.loginService.login(user_name, password).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
        console.log(res);
      },
      (error) => {
        // console.log('Loi', error);
        this.loginStatus = false
      }
    );
  }
}
