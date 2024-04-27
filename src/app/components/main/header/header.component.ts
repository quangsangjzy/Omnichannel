import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComponentdialogComponent } from './componentdialog/componentdialog.component';
import { LoginserviceService } from '../../auth/loginservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/authservice.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // providers: [ConfirmationService, MessageService],
})
export class HeaderComponent {
  userInfo: any;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserDetails();
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ComponentdialogComponent, {
      width: '400px',
      data: {
        title: 'Đăng xuất',
        message: 'Bạn chắc chắn muốn đăng xuất chứ?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.logout();
        this.router.navigate(['/login']);
      } else {
        return;
      }
    });
  }

  openUpdatePassword(): void {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: '500px',
    });
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    this.http
      .post(
        'http://localhost:8080/api/v1/users/detail',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .subscribe(
        (response: any) => {
          this.userInfo = response;
          console.log(this.userInfo);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  logout(): void {
    this.authService.removeToken();
  }
}
