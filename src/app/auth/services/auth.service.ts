import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DatosUsuarioLogin } from '../models/datosUsuarioLogin.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioAutenticado: DatosUsuarioLogin | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  autentificacion(usuario: DatosUsuarioLogin): Observable<boolean> {
    //return this.http.get<DatosUsuarioLogin>('http://localhost:3000/backend/data/usuario-mi-banco.json').pipe(
    return this.http.get<DatosUsuarioLogin>('https://www.claudiosalazar.cl/mi-banco/angular/backend/data/usuario-mi-banco.json').pipe(
      map(datosServidor => {
        const autenticado = usuario.rutUsuario === datosServidor.rutUsuario && usuario.claveUsuario === datosServidor.claveUsuario;
        if (autenticado) {
          // Establece el estado de autenticación
          localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
          console.log('Invalid credentials');
        }
        return autenticado;
      }),
      catchError(error => {
        console.error('Error obteniendo datos del servidor:', error);
        return of(false);
      })
    );
  }

  estaAutenticado(): boolean {
    return this.usuarioAutenticado !== null;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['login']);
  }
}