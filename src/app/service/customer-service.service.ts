import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  private selectedUserSource = new BehaviorSubject<{ id: number; name: string; img: string; } | null>(null);

  selectedUser$ = this.selectedUserSource.asObservable();

  selecUser(user: {id:number; name:string; img:string;}){
    this.selectedUserSource.next(user)
  }
  // constructor() { console.log(this.selectedUserSource)}
}
