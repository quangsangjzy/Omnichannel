import { Component, Renderer2 } from '@angular/core';
import { MessagepageComponent } from './messagepage/messagepage.component';
import { Routes, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-detailchat',
  standalone: true,
  templateUrl: './detailchat.component.html',
  styleUrl: './detailchat.component.scss',
  imports: [MessagepageComponent, CommonModule],
})
export class DetailchatComponent {
  public isBoxChatVisible: boolean = true;
  constructor(private renderer: Renderer2, private chatService: ChatService) {}

  ngOnInit(){
    this.hideBoxChat()
  }

  hideBoxChat() {
    this.isBoxChatVisible = false;
    this.chatService.userClicked$.subscribe(event =>{
      this.isBoxChatVisible = true;
    })
  }
}
