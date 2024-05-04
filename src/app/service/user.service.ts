import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { User } from '../interfaces/user';
import { ConversationResponse } from '../interfaces/conversation-response';
import { MessageRequest } from '../interfaces/message-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}

  // Attempt to log in a user with the provided credentials
  // userLogin(body: LoginRequest): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(this.baseUrl.concat('/login'), body);
  // }

  userLogin(username: any): Observable<User> {
    url: 'http://localhost:8080/user/login';
    // return this.http.post<User>(this.baseUrl.concat('/login'),username);
    console.log(this.http.post('http://localhost:8080/user/login', username));
    return this.http.post<User>('http://localhost:8080/user/login', username);
  }
  // Register a new user with the provided user data
  userRegister(body: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl.concat('/register'), body);
  }

  userLogin2(id: any): Observable<any> {
    let url = 'http://localhost:8080/user/login/test';
    url += '?id=' + id;
    return this.http.get(url);
  }

  // Retrieve a list of all users except the currently logged-in user
  getAllUsersExceptCurrentUser(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      this.baseUrl.concat('/boxchat/' + this.currentUser().id)
    );
  }

  saveMessage(messageRequest: MessageRequest): Observable<MessageRequest> {
    return this.http.post<MessageRequest>('http://localhost:8080/saveMessageReplyCustomer', messageRequest);
  }

  // Retrieve the conversation ID between two users
  getConversationIdByUser1IdAndUser2Id(
    user1Id: string,
    user2Id: string
  ): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl.concat('/conversation/id'), {
      params: { user1Id: user1Id, user2Id: user2Id },
    });
  }

  // Retrieve the currently logged-in user from local storage
  currentUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
