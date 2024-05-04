import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { MessageRequest } from '../../../interfaces/message-request';
import { ApiResponse } from '../../../interfaces/api-response';
import { User } from '../../../interfaces/user';
import { ConversationResponse } from '../../../interfaces/conversation-response';
import { MessageResponse } from '../../../interfaces/message-response';
import { StompService } from '../../../service/stomp.service';
import { Subscription } from 'rxjs';
import { WebSocketResponse } from '../../../interfaces/web-socket-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ChatPageComponent implements OnDestroy {
  isSearchBoxVisible: boolean = false;
  keyword: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef;

  currentUser: User = {
    id: '',
    name: '',
    image: '',
  };

  userConversation: ConversationResponse = {
    lastMessage: '',
    conversationId: 0,
    otherUserId: '',
    otherUserName: '',
    otherUserImage: '',
    lastMessageTimestamp: '',
    pageName: '',
  };
  userConversations: ConversationResponse[] = [];
  // all users except current user
  users: User[] = [];
  // users all conversations

  // current user conversation subscription
  stompUserSub: Subscription | undefined;

  // selected conversation
  selectedConversationId: number = -1;
  selectedConversationReceiverId: string = '';
  selectedConversationReceiverName: string = '';
  selectedConversationReceiverImage: string = '';
  selectedConversationReceiverLastMessage: string = '';
  selectedConversationReceiverPageName: string = '';
  // selected conversation messages
  selectedConversation: MessageResponse[] = [];
  // selected conversation messages subscription
  stompConvSub: Subscription | undefined;

  // Boolean flag to indicate whether showing users or conversation on left column
  showUserState: boolean = true;
  // Input field for send message
  message: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private stomp: StompService
  ) {
    this.currentUser = userService.currentUser();
  }

  ngOnInit(): void {
    // Subscribe to userId websocket to get updated conversation when gets new messages
    this.subscribeToCurrentUserConversation();
    this.searchUser();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all channels onDestroy
    this.stompUserSub?.unsubscribe();
    this.stompConvSub?.unsubscribe();
  }

  // When click the new/add button Then get all users and set users list
  onShowHideUserConversation() {
    this.userService
      .getAllUsersExceptCurrentUser()
      .subscribe((res: ApiResponse) => {
        this.userConversations = res.data;
      });
  }

  setMessageConversation() {
    // unsubscribe any previous subscription
    this.stompConvSub?.unsubscribe();
    // then subscribe to selected conversation
    // when get new message then add the message to first of the array
    this.stompConvSub = this.stomp.subscribe(
      'conv/' + this.selectedConversationId,
      (payload: any) => {
        let res: WebSocketResponse = payload;
        if (res.type == 'ALL') {
          this.userConversation.lastMessage = res.data.lastMessage;
        }
      }
    );
  }

  // Close a chat from dropdown menu
  onCloseChat() {
    this.stompConvSub?.unsubscribe();
    this.selectedConversationId = -1;
  }

  // When click logout button Then remove user from localStorage and navigate to homepage
  onUserLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['.']);
  }

  subscribeToCurrentUserConversation() {
    // setting one second delayed to successfully connect the stomp to server
    setTimeout(() => {
      this.stompUserSub = this.stomp.subscribe(
        'user/' + this.currentUser.id,
        (payload: any) => {
          let res: WebSocketResponse = payload;
          if (res.type == 'ALL') {
            this.userConversations = res.data;
            const found = this.userConversations.find(
              (item) => item.conversationId === this.selectedConversationId
            );
            if (found === undefined) {
              this.onCloseChat();
            }
          }
        }
      );
      // Notify that I'm subscribed to get initial data
      this.stomp.send('user', this.currentUser.id);
    }, 1000);
    this.onShowHideUserConversation();
  }

  // When new or exiting user selected Then set the variables and get the two users
  // conversationId from the database
  onUserSelected(receiverId: string, receiverName: string) {
    this.selectedConversationReceiverId = receiverId;
    this.selectedConversationReceiverName = receiverName;
    this.userService
      .getConversationIdByUser1IdAndUser2Id(receiverId, this.currentUser.id)
      .subscribe((res: ApiResponse) => {
        this.selectedConversationId = res.data;
        this.onShowHideUserConversation();
        this.setConversation();
      });
  }

  // When user select a conversation from the list
  onConversationSelected(index: number) {
    this.selectedConversationId = this.userConversations[index].conversationId;
    this.selectedConversationReceiverId =
      this.userConversations[index].otherUserId;
    this.selectedConversationReceiverName =
      this.userConversations[index].otherUserName;
    // this.selectedConversationReceiverImage =
    //   this.userConversations[index].otherUserImage;
    // this.selectedConversationReceiverLastMessage =
    //   this.userConversations[index].lastMessage;
    // this.selectedConversationReceiverPageName =
    //   this.userConversations[index].pageName;
    this.setConversation();
  }

  reversedArray: MessageResponse[] = [];
  // Set a conversation of selected conversationId
  setConversation() {
    // unsubscribe any previous subscription
    this.stompConvSub?.unsubscribe();
    // then subscribe to selected conversation
    // when get new message then add the message to first of the array
    this.stompConvSub = this.stomp.subscribe(
      'conv/' + this.selectedConversationId,
      (payload: any) => {
        let res: WebSocketResponse = payload;
        if (res.type == 'ALL') {
          this.selectedConversation = [];
          this.reversedArray = res.data;
          for (let i = this.reversedArray.length - 1; i >= 0; i--) {
            if (this.selectedConversation.length < this.reversedArray.length)
              this.selectedConversation.push(this.reversedArray[i]);
          }
        } else if (res.type == 'ADDED') {
          let msg: MessageResponse = res.data;
          this.selectedConversation.unshift(msg);
        }
      }
    );
    // Notify that I'm subscribed to get initial data
    this.stomp.send('conv', this.selectedConversationId);
  }

  // Send message to other user
  onSendMessage() {
    // If message field is empty then return
    if (this.message.trim().length == 0) return;

    const timestamp = new Date();
    let body: MessageRequest = {
      conversationId: this.selectedConversationId,
      senderId: this.userService.currentUser().id,
      receiverId: this.selectedConversationReceiverId,
      message: this.message.trim(),
      // timestamp: timestamp,
    };
    console.log(body);
    this.userService.saveMessage(body).subscribe((res: MessageRequest) => {
      console.log(res);
    });
    this.stomp.send('sendMessage', body);
    this.message = '';
  }

  // When click Delete chat from the dropdown menu Then delete the conversation
  // with it's all messages
  onDeleteConversation() {
    this.stomp.send('deleteConversation', {
      conversationId: this.selectedConversationId,
      user1Id: this.currentUser.id,
      user2Id: this.selectedConversationReceiverId,
    });
  }

  // When click delete on a message menu Then delete from database Then refresh
  // conversation list
  onDeleteMessage(messageId: number) {
    this.stomp.send('deleteMessage', {
      conversationId: this.selectedConversationId,
      messageId: messageId,
    });
  }

  showSearchBox(): void {
    this.isSearchBoxVisible = !this.isSearchBoxVisible;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  hideSearchBox(event: Event): void {
    if (!this.searchInput.nativeElement.contains(event.target)) {
      this.isSearchBoxVisible = false; // Ẩn box khi click ra ngoài ô input
    }
  }

  searchUser(): any[] {
    return this.userConversations.filter((user) => {
      console.log(user);
    });
  }
}
