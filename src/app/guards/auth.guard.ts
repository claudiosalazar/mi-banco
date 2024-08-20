import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate: CanActivateFn = (): Observable<boolean> => {
    const token = localStorage.getItem('token');
    const idUser = localStorage.getItem('id_user');
    if (!token || !idUser) {
      console.log('Token no es válido o expiró o id_user no está presente');
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