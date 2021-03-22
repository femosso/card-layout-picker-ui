import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user: User;

  constructor(private authService: AuthService) {
      this.authService.user.subscribe(x => this.user = x);
  }

  isRole(role: string) {
    return this.user.role == role;
  }

  logout() {
      this.authService.logout();
  }
}