import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap, Observable, of } from 'rxjs';
import { TokenService } from './tokenService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  mibanco(user: any) { 
    return this.http.post(`${this.apiUrl}/user/mibanco`, user).pipe(
      tap((res: any) => {
        localStorage.setItem('id_user', res.id_user);
        this.tokenService.setToken(res.token);
      })
    );
  }

  isAuth(): Observable<boolean> {
    const token = this.tokenService.getToken();
    const userId = localStorage.getItem('id_user');
    if (this.jwtHelper.isTokenExpired(token) || !token || !userId) {
      return of(false);
    } 
    return of(true);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}