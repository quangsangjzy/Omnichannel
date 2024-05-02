import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from '../../../service/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  selectedUserId: string | null;
  stompClient: any;
  nickname:string
  fullname:string;

  private userClickedSource = new Subject<any>();
  userClicked$ = this.userClickedSource.asObservable();

  constructor(private userService: UserService) {
    this.userService.nickname$.subscribe((nickname) => {
      this.nickname = nickname;
    });
    this.userService.fullname$.subscribe((fullname) => {
      this.fullname = fullname;
    });

  }

  emitUserClicked(event: Event): void {
    this.userClickedSource.next(event);
  }
  
}
