import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceService } from '../../../../service/customer-service.service';
import { FacebookService } from '../../../../service/facebookservice.service';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from '../../../../truncate.pipe';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  delay,
  delayWhen,
  retry,
  retryWhen,
  switchMap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-listchat',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TruncatePipe],
  templateUrl: './listchat.component.html',
  styleUrl: './listchat.component.scss',
})
export class ListchatComponent {


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
