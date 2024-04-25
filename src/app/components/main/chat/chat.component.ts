import { Component } from '@angular/core';
import { ListchatComponent } from "./listchat/listchat.component";
import { DetailchatComponent } from './detailchat/detailchat.component';
import { HeaderchatComponent } from "./headerchat/headerchat.component";

@Component({
    selector: 'app-chat',
    standalone: true,
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    imports: [ListchatComponent, DetailchatComponent, HeaderchatComponent]
})
export class ChatComponent {

}
