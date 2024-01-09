import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  authenticate(user: User) {
    // Aquí es donde normalmente harías una llamada a un servidor de backend.
    // Para este ejemplo, simplemente comprobamos los datos del usuario contra los datos mockup.
    if (user.user === '1-1' && user.password === 'usuario-12345') {
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['mibanco']);  // Aquí es donde rediriges al usuario al componente 'main'.
    } else {
      alert('Invalid credentials');
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }
}