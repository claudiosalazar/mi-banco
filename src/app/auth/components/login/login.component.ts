import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = { user: '', password: '' };

  constructor(private authService: AuthService) { }

  login() {
    this.authService.authenticate(this.user);
  }
}