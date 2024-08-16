import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://claudiosalazar.cl/mi-banco';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router 
  ) { }

  mibanco(user: any) { 
    return this.http.post(`${this.apiUrl}/user/mibanco`, user);
  }

  isAuth(): boolean {
    const token = localStorage.getItem('token');
    if (this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')) {
      return false;
    } 
    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
