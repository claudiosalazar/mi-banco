import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router 
  ) { }

  mibanco(user: any) { 
    return this.http.post(`${this.apiUrl}/user/mibanco`, user).pipe(
      tap((res: any) => {
        localStorage.setItem('id_user', res.id_user);
      })
    );
  }

  isAuth(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id_user');
    if (this.jwtHelper.isTokenExpired(token) || !token || !userId) {
      return of(false);
    } 
    return of(true);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id_user');
    this.router.navigate(['/login']);
  }
}