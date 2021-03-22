import { Component } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;

    constructor(private authService: AuthService) {
        this.user = this.authService.userValue;
    }
}