import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly token = 'token';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem(this.token);
  }

  // iểm tra xem người dùng đã đăng nhập hay chưa
  isLoggedIn(){
    const token = localStorage.getItem('token');
    return !!token;
  }
}
