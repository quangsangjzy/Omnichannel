import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { UserService } from '../../../../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-messagepage',
  standalone: true,
  imports: [],
  templateUrl: './messagepage.component.html',
  styleUrl: './messagepage.component.scss',
})
export class MessagepageComponent {
  @ViewChild('chatmessages') chatArea: ElementRef;
  @ViewChild('message') messageInput: ElementRef;
  @ViewChild('messageForm') messageForm: ElementRef;

  nickname: string;
  fullname: string;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.userClicked$.subscribe((event) => {
      this.fetchAndDisplayUserChat().then();
    });
  }

  displayMessage(senderId: string, content: string): void {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    console.log(senderId, content);
    if (senderId === this.nickname) {
      messageContainer.classList.add('sender');
    } else {
      messageContainer.classList.add('receiver');
    }
    const message = document.createElement('p');
    message.textContent = content;
    messageContainer.appendChild(message);

    this.chatArea.nativeElement.appendChild(messageContainer);
  }

  async fetchAndDisplayUserChat(): Promise<void> {
    this.userService.nickname$.subscribe((nickname) => {
      this.nickname = nickname;
    });
    this.userService.fullname$.subscribe((fullname) => {
      this.fullname = fullname;
    });

    const selectedUserId = this.chatService.selectedUserId;
    const userChatResponse = await this.http
      .get(`http://localhost:8080/messages/${this.nickname}/${selectedUserId}`)
      .toPromise();

    // console.log(userChatResponse);
    const userChat: any[] = userChatResponse as [];
    // console.log(userChat);

    this.chatArea.nativeElement.innerHTML = '';
    userChat.forEach((chat) => {
      // console.log(chat)
      this.displayMessage(chat.senderId, chat.content);
    });
    this.chatArea.nativeElement.scrollTop =
      this.chatArea.nativeElement.scrollHeight;
    // console.log(userChat);
  }

  sendMessage(event: Event): void {
    const messageContent = this.messageInput.nativeElement.value.trim();
    console.log(messageContent)
    if (messageContent && this.chatService.stompClient) {
      const chatMessage = {
        senderId: this.nickname,
        recipientId: this.chatService.selectedUserId,
        content: this.messageInput.nativeElement.value.trim(),
        timestamp: new Date(),
      };
      this.chatService.stompClient.send(
        '/app/chat',
        {},
        JSON.stringify(chatMessage)
      );
      this.displayMessage(
        this.nickname,
        this.messageInput.nativeElement.value.trim()
      );
      this.messageInput.nativeElement.value = '';
    }
    this.chatArea.nativeElement.scrollTop =
      this.chatArea.nativeElement.scrollHeight;
    event.preventDefault();
  }

  async onMessageReceived(payload: any): Promise<void> {
    // const selectedUserId = this.chatService.selectedUserId;
    // // await findAndDisplayConnectedUsers();
    // console.log('Message received', payload);
    // const message = JSON.parse(payload.body);
    // if (
    //   this.chatService.selectedUserId &&
    //   this.chatService.selectedUserId === message.senderId
    // ) {
    //   this.displayMessage(message.senderId, message.content);
    //   this.chatArea.nativeElement.scrollTop =
    //     this.chatArea.nativeElement.scrollHeight;
    // }
    // if (selectedUserId) {
    //   const selectedUser = document.querySelector(`#${selectedUserId}`);
    //   if (selectedUser) {
    //     selectedUser.classList.add('active');
    //   }
    // } else {
    //   this.messageForm.nativeElement.classList.add('hidden');
    // }
    // const notifiedUser = document.querySelector(`#${message.senderId}`);
    // console.log(notifiedUser)
  }
}
