import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  @ViewChild('usernameForm', { static: true }) usernameForm!: ElementRef;

  private _nickname: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _fullname: BehaviorSubject<string> = new BehaviorSubject<string>('');

  nickname$ = this._nickname.asObservable();
  fullname$ = this._fullname.asObservable();


  constructor(private router: Router) {}

  setNickname(nickname: string):void {
    this._nickname.next(nickname)
  }

  setFullname(fullname: string):void {
    this._fullname.next(fullname)
  }
}
