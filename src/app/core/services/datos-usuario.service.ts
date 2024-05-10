import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

// Models
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  //private baseUrl = 'http://localhost:3000/backend/data/datos-usuario.json';
  baseUrl = environment.baseUrl;

  private datosUsuarioEditado = new Subject<any>();

  constructor(
    private http: HttpClient
  ) { }

    getDatosUsuario(): Observable<DatosUsuarioActual> {
      const observable = this.http.get<DatosUsuarioActual>(this.baseUrl + '/backend/data/datos-usuario.json');
      return observable;
    }
    
    guardarDestinatarioEditado(datosUsuarioEditado: any): Observable<any> {
      console.log('Datos enviados al server:', datosUsuarioEditado);
      return this.http.put(`${this.baseUrl + '/backend/data/datos-usuario.json'}`, datosUsuarioEditado, {responseType: 'text'}).pipe(
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


import { RegionesCiudadComuna } from '../../shared/models/regiones-ciudad-comuna.model';


@Injectable({
  providedIn: 'root'
})
export class ListaGeograficaService {

  //private baseUrlGeografica = 'http://localhost:3000/backend/data/regiones-ciudad-comuna.json';
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getListaGeografica(): Observable<RegionesCiudadComuna> {
    const observable = this.http.get<RegionesCiudadComuna>(this.baseUrl + '/backend/data/regiones-ciudad-comuna.json');
    return observable;
  }

}

import { RegionesCiudadComunaComercial } from '../../shared/models/regiones-ciudad-comuna.model';

@Injectable({
  providedIn: 'root'
})
export class ListaGeograficaComercialService {

  //private baseUrlGeografica = 'http://localhost:3000/backend/data/regiones-ciudad-comuna.json';
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getListaGeograficaComercial(): Observable<RegionesCiudadComunaComercial> {
    const observable = this.http.get<RegionesCiudadComunaComercial>(this.baseUrl + '/backend/data/regiones-ciudad-comuna.json');
    return observable;
  }

}


