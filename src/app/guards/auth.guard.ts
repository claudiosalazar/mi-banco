import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenService } from '../services/tokenService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  canActivate: CanActivateFn = (): Observable<boolean> => {
    const token = this.tokenService.getToken();
    const idUser = localStorage.getItem('id_user');
    if (!token || !idUser) {
      this.router.navigate(['login']);
      return of(false);
    }

    return this.authService.isAuth().pipe(
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['login']);
        return of(false);
      })
    );
  }
}