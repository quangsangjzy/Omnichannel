import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { LoginserviceService } from '../loginservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('loginPageForm') loginPageForm!: ElementRef;
  @Output() LoginEvent = new EventEmitter<{
    nickname: string;
    fullname: string;
  }>();
  //
  loginForm: FormGroup;
  loginStatus: boolean | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginserviceService,
    private spinner: NgxSpinnerService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.loginStatus = true;
    });
  }

  ngOnInit() {}

  onSubmit(nickName: string, fullName: string): void {
    this.userService.setNickname(nickName);
    this.userService.setFullname(fullName);
    this.router.navigate(['/home']);
  }

  login(user_name: string, password: string): void {
    this.loginService.login(user_name, password).subscribe(
      (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        } else {
          console.log('Không có token');
        }
      },
      (error) => {
        // console.log('Loi', error);
        this.loginStatus = false;
      }
    );
  }

  loading() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
}
