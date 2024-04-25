import { Component } from '@angular/core';
import { MessagepageComponent } from "./messagepage/messagepage.component";
import { CurrentpageComponent } from "./currentpage/currentpage.component";

@Component({
    selector: 'app-detailchat',
    standalone: true,
    templateUrl: './detailchat.component.html',
    styleUrl: './detailchat.component.scss',
    imports: [MessagepageComponent, CurrentpageComponent]
})
export class DetailchatComponent {
  
}
