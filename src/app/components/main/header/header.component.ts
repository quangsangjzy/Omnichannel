import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ComponentdialogComponent } from './componentdialog/componentdialog.component';
import { LoginserviceService } from '../../auth/loginservice.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  // providers: [ConfirmationService, MessageService],
})
export class HeaderComponent {
  userDetails: any;
  constructor(
    public dialog: MatDialog,
    private userDetail: LoginserviceService
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
        // Logout
        console.log(true);
      } else {
        return;
      }
    });
  }

  getUserDetails(): void {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      this.userDetail.getUserDetails().subscribe((res) => {
        console.log("thông tin user: ", res)
      }, err => {
        console.log("lỗi", err)
      })
    } else{
      console.error("token not found")
    }
  }
}
