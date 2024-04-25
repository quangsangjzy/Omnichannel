import { Component } from '@angular/core';

@Component({
  selector: 'app-messagepage',
  standalone: true,
  imports: [],
  templateUrl: './messagepage.component.html',
  styleUrl: './messagepage.component.scss'
})
export class MessagepageComponent {
  message:{text:string, isMine:boolean}[] = [
    {text:"Tôi muốn mua hàng",isMine: false},
    {text:"Giá sản phẩm này là bao nhiêu" ,isMine: false},
    {text:"Tôi có thể giúp gì được cho bạn",isMine: true},
    {text:"Giá sản phẩm này là ....",isMine: true},
  ]

  // isMymessage(message: {text: string, isMine: boolean}):boolean{
  //   return message
  // }
}
