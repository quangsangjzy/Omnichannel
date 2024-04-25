import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginserviceService {
  constructor(private http: HttpClient) {}

  login(user_name: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/users/login', {
      user_name,
      password,
    });
  }

  
  getUserDetails(): Observable<any>{
    return this.http.get("http://localhost:8080/api/v1/users/detail")
  }
}
