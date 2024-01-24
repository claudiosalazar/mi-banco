import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuarioActual } from '../../assets/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {
  private url = 'assets/data/datos-usuario.json';
  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuarioActual> {
    return this.http.get<DatosUsuarioActual>(this.url);
  }

}


