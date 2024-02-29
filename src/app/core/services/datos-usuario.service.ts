import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {
  private baseUrl = 'http://localhost:3000/backend/data/datos-usuario.json';
  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuarioActual> {
    const observable = this.http.get<DatosUsuarioActual>(this.baseUrl);
    // observable.subscribe(datos => console.log('Datos usuario recibidos:', datos));
    return observable;
  }

}


