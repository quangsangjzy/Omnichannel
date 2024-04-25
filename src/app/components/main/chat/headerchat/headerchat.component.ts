import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceService } from '../../../../service/customer-service.service';

@Component({
  selector: 'app-headerchat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './headerchat.component.html',
  styleUrl: './headerchat.component.scss',
})
export class HeaderchatComponent {
  selectedUSer: { id: number; name: string; img: string } | null = null;

  constructor(private userselectedService: CustomerServiceService) {}

  ngOnInit(){
    this.userselectedService.selectedUser$.subscribe(user => {
      this.selectedUSer = user
    })
  }
}
