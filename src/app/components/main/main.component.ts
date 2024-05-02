import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';
import { AuthService } from '../auth/authservice.service';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [SidebarComponent, HeaderComponent, ChatComponent],
})
export class MainComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    window.addEventListener('beforeunload', function () {
      // localStorage.removeItem('token');
    });
  }
  
  checkAuth(){
    window.history.pushState({}, '/home')
    window.addEventListener('popstate', function(){
        const token = localStorage.getItem('token')
        if(token){
            // localStorage.removeItem('token')
        }
    })
  }
}
