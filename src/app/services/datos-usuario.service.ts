import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuarioActual } from '../../assets/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {
  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuarioActual> {
    return this.http.get<DatosUsuarioActual>('assets/data/datos-usuario.json');
  }
}

export class MontosUsuarioService {
  constructor(private http: HttpClient) { }

  getMontosUsuario(): Observable<DatosUsuarioActual> {
    return this.http.get<DatosUsuarioActual>('assets/data/datos-usuario.json');
  }
}
