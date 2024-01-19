import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuario } from '../../assets/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuario> {
    return this.http.get<DatosUsuario>('assets/data/datos-usuario.json');
  }
}
