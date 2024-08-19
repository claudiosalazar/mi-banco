import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id_user');
    if (!token || !this.authService.isAuth() || !userId) {
      console.log('Token no es válido o expiró o id_user no está presente'); 
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
}