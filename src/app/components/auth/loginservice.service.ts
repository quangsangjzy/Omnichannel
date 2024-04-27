import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginserviceService implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  login(user_name: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/users/login', {
      user_name,
      password,
    });
  }

  updatePassword(currentPassword: string, newPassword: string){
    const url = 'http://localhost:8080/api/v1/users/updatePassword'
    const body = {currentPassword, newPassword}
    return this.http.post(url, body)
  }
  
}
