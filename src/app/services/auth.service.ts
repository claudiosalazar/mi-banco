import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router 
  ) { }

  mibanco(user: any) { 
    return this.http.post(`${this.URL}/user/mibanco`, user);
  }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')) {
      return false;
    } 
    return true;
  }

  logout(): void {
    localStorage.removeItem('token'); // Eliminar el token del localStorage
    this.router.navigate(['/login']); // Redirigir a la página de login
  }
}
