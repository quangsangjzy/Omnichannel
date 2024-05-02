import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeaderComponent } from '../header.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import Validation from '../../../auth/validation';
import { HttpClient } from '@angular/common/http';
import { LoginserviceService } from '../../../auth/loginservice.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent {
  submitted = false;
  loginForm!: FormGroup;
  loginStatus: boolean | null = null;

  isOldPasswordCorrect: boolean | null = null;

  form: FormGroup = new FormGroup({
    currentPassword: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<HeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private service: LoginserviceService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    console.log(JSON.stringify(this.form.value, null, 2));
    this.checkPassword();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  checkPassword(): void {
    const token = localStorage.getItem('token');
    const {currentPassword, password, confirmPassword} = this.form.value

    const payload = {currentPassword, password}
    this.http
      .put<any>(
        'http://localhost:8080/api/v1/users/updatePassword',
        {payload},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .subscribe(
        result => {
          if(result.error){
            console.log(result.error.message)
          }else{
            console.log("Doi mat khau thanh cong")
          }
        },
        (error) => {
          console.log('Doi mat khau khong thanh cong', error);
        }
      );
  }
}
