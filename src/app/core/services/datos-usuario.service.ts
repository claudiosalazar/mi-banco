import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private baseUrl = 'http://localhost:3000/backend/data/datos-usuario.json';

  private datosUsuarioEditado = new Subject<any>();

  constructor(
    private http: HttpClient
    ) { }

    getDatosUsuario(): Observable<DatosUsuarioActual> {
      const observable = this.http.get<DatosUsuarioActual>(this.baseUrl);
      return observable;
    }
    
    guardarDestinatarioEditado(datosUsuarioEditado: any): Observable<any> {
      console.log('Datos enviados al server:', datosUsuarioEditado);
      return this.http.put(`${this.baseUrl}`, datosUsuarioEditado, {responseType: 'text'}).pipe(
        map((res: any) => {
          console.log('Datos recibidos del server:', res);
          return res;
        }),
        catchError(error => {
          console.error('Error del server:', error);
          return throwError(error);
        })
      );
    }

}


