import { Component, DoBootstrap } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FacebookService } from './service/facebookservice.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { ChatService } from './components/main/chat/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    HttpClientModule,
    RouterOutlet,
    LoginComponent,
    MainComponent,
    ReactiveFormsModule,
    MatDialogModule,
    NgxSpinnerModule,
  ],
  providers: [],
})
export class AppComponent {
  title = 'Omnichanel';
}
