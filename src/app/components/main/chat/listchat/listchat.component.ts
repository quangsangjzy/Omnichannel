import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
  QueryList,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from '../../../../truncate.pipe';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { UserService } from '../../../../service/user.service';
import { ChatService } from '../chat.service';
import { DetailchatComponent } from '../detailchat/detailchat.component';
import { Subject } from 'rxjs';
import { MessagepageComponent } from '../detailchat/messagepage/messagepage.component';

@Component({
  selector: 'app-listchat',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TruncatePipe],
  templateUrl: './listchat.component.html',
  styleUrl: './listchat.component.scss',
})
export class ListchatComponent {
  @ViewChild('connectedUsersList')
  connectedUsersList: ElementRef;
  @ViewChild('user-item') userItems!: QueryList<ElementRef>;

  // connectedUsersList: string;
  connectedFullName: string;
  stompClient: any;
  nickname: string;
  fullname: string;


  constructor(
    private http: HttpClient,
    private userService: UserService,
    private renderer: Renderer2,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.connect();
  }

  // logData() {}

  connect() {
    this.userService.nickname$.subscribe((nickname) => {
      this.nickname = nickname;
    });
    this.userService.fullname$.subscribe((fullname) => {
      this.fullname = fullname;
    });

    if (this.nickname && this.fullname) {
      const socket = new SockJS('http://localhost:8080/ws');
      this.chatService.stompClient = Stomp.over(socket);

      this.chatService.stompClient.connect(
        {},
        this.onConnected.bind(this),
        this.onError.bind(this)
      );
    }
    // if (event) {
    //   event.preventDefault();
    // }
  }

  onConnected() {
    this.chatService.stompClient.subscribe(
      `/user/${this.nickname}/queue/messages`,
      this.onMessageReceived.bind(this)
    );
    this.chatService.stompClient.subscribe(
      `/user/public`,
      this.onMessageReceived.bind(this)
    );

    this.chatService.stompClient.send(
      '/app/user.addUser',
      {},
      JSON.stringify({
        nickName: this.nickname,
        fullName: this.fullname,
        status: 'ONLINE',
      })
    );
    this.connectedFullName = this.fullname;

    // console.log(this.nickname);
    // console.log(this.fullname);
    this.findAndDisplayConnectedUsers().then();
  }

  async findAndDisplayConnectedUsers(): Promise<void> {
    // debugger;
    const connectedUsersResponse = await this.http
      .get('http://localhost:8080/users')
      .toPromise();

    let conncetedUser: any[] = connectedUsersResponse as any[];
    // console.log(conncetedUser);

    // Userlist
    const userList = this.connectedUsersList.nativeElement;
    this.connectedUsersList.nativeElement.textContent = '';
    conncetedUser.filter((user) => {
      user.nickName !== this.nickname;
    });

    // console.log(userList);

    conncetedUser.forEach((user) => {
      this.appendUserElement(user, userList);
      if (conncetedUser.indexOf(user) < conncetedUser.length - 1) {
        const separator = this.renderer.createElement('li');
        this.renderer.addClass(separator, 'separator');
        this.renderer.appendChild(userList, separator);
      }
      // console.log(user);
    });
  }

  appendUserElement(user: any, userList: HTMLElement): void {
    if (userList instanceof HTMLElement) {
      const listItem = this.renderer.createElement('li');
      this.renderer.addClass(listItem, 'user-item');
      listItem.id = user.nickName;

      const userImage = this.renderer.createElement('img');
      userImage.src = 'assets/images/avt_customer.png';
      userImage.alt = user.fullName;

      const usernameSpan = this.renderer.createElement('span');
      this.renderer.setProperty(usernameSpan, 'textContent', user.fullName);

      const receivedMsgs = this.renderer.createElement('span');
      this.renderer.setProperty(receivedMsgs, 'textContent', '0');
      this.renderer.addClass(receivedMsgs, 'nbr-msg');
      this.renderer.addClass(receivedMsgs, 'hidden');

      this.renderer.appendChild(listItem, userImage);
      this.renderer.appendChild(listItem, usernameSpan);
      this.renderer.appendChild(listItem, receivedMsgs);

      this.renderer.listen(listItem, 'click', this.userItemClick.bind(this));

      this.renderer.appendChild(userList, listItem);
    } else {
      console.error('connectedUsersList is not a valid HTMLElement.');
    }
  }

  // emitUserClicked(user: any): void {
  //   console.log(user)
  // }

  userItemClick(event: Event): void {
    document.querySelectorAll('.user-item').forEach((item) => {
      item.classList.remove('active');
    });

    this.chatService.emitUserClicked(event);

    const clickUser = event.currentTarget as HTMLElement;
    this.renderer.addClass(clickUser, 'active');

    this.chatService.selectedUserId = clickUser.getAttribute('id');

    const nbrMsg = clickUser.querySelector('.nbr-msg');
    if (nbrMsg) {
      nbrMsg.classList.add('hidden');
      nbrMsg.textContent = '0';
    }
  }

  onError(error: any) {
    console.error('Day la ham loi', error);
  }

  async onMessageReceived(payload: any): Promise<void> {
    
  }

  // extractTime(time: string) {
  //   // Tách chuỗi theo dấu 'T'
  //   const [datePart, timePart] = time.split('T');
  //   // Tách phần giờ và phút từ timePart
  //   const [hour, minute] = timePart.split(':');
  //   // Trả về chuỗi giờ và phút
  //   return `${hour}:${minute}`;
  // }

  // onUserClick(user: { id: number; name: string; img: string }) {
  //   this.userSelectionService.selecUser(user);
  // }
}
