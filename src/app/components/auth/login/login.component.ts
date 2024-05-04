// import {
//   Component,
//   ElementRef,
//   EventEmitter,
//   HostListener,
//   Output,
//   ViewChild,
// } from '@angular/core';
// import { FormControl, NgForm, ReactiveFormsModule } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NavigationStart, Router } from '@angular/router';
// import { LoginserviceService } from '../loginservice.service';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { UserService } from '../../../service/user.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent {
//   @ViewChild('loginPageForm') loginPageForm!: ElementRef;
//   @Output() LoginEvent = new EventEmitter<{
//     nickname: string;
//     fullname: string;
//   }>();
//   //
//   loginForm: FormGroup;
//   loginStatus: boolean | null = null;
//   isLoading = false;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private loginService: LoginserviceService,
//     private spinner: NgxSpinnerService,
//     private userService: UserService
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });

//     this.loginForm.valueChanges.subscribe(() => {
//       this.loginStatus = true;
//     });
//   }

//   ngOnInit() {}

//   onSubmit(nickName: string, fullName: string): void {
//     this.userService.setNickname(nickName);
//     this.userService.setFullname(fullName);
//     this.router.navigate(['/home']);
//   }

//   login(user_name: string, password: string): void {
//     this.loginService.login(user_name, password).subscribe(
//       (res) => {
//         if (res.token) {
//           localStorage.setItem('token', res.token);
//           this.router.navigate(['/home']);
//         } else {
//           console.log('Không có token');
//         }
//       },
//       (error) => {
//         // console.log('Loi', error);
//         this.loginStatus = false;
//       }
//     );
//   }

//   loading() {
//     this.spinner.show();

//     setTimeout(() => {
//       /** spinner ends after 5 seconds */
//       this.spinner.hide();
//     }, 5000);
//   }
// }

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../interfaces/api-response';
import { LoginRequest } from '../../../interfaces/login-request';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  // Boolean flag to determine whether the user is in login or registration mode
  isLogin: boolean = true;

  // Boolean flag to indicate whether a user was not found during login
  userNotFound: boolean = false;

  // Input fields for user registration and login
  name: string = '';
  id: string = '';

  userForm = new FormGroup({
    id: new FormControl(''),
  });

  constructor(private userService: UserService, private router: Router) {
    // Check if the user is already logged in, and if so, redirect to the chat page
    if (localStorage.getItem('user') != null) {
      this.router.navigate(['chat']);
    }
  }

  // Toggle between login and registration modes
  toggleAuth(): void {
    this.isLogin = !this.isLogin;
    // this.userNotFound = false;
  }

  onUserLogin() {
    //   let body: LoginRequest = {
    //     id: this.id,
    //   };
    const id = this.userForm.value.id;
    console.log(id);

    this.userService.userLogin2(this.userForm.value.id).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['chat']);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
