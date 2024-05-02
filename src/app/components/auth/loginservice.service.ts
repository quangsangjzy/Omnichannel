import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginserviceService implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  login(user_name: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/users/login', {
      user_name,
      password,
    });
  }

  changePassword(data: any) {
    var headers = new HttpHeaders().set(
      'Authorization',
      'Bearer' + localStorage.getItem('token')
    );
    var options = { headers: headers };

    return this.http.put(
      'http://localhost:8080/api/v1/users/updatePassword',
      data,
      options
    );
  }
}
