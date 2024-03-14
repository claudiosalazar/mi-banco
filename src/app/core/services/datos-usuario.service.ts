import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuarioActual } from '../../shared/models/datos-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private baseUrl = 'http://localhost:3000/backend/data/datos-usuario.json';

  datosUsuarioActual: DatosUsuarioActual | undefined;
  primerNombre: string | undefined;
  segundoNombre: string | undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;
  rut: string | undefined;
  email: string | undefined;
  fonoCelular: string | undefined;
  fonoParticular: string | undefined;
  direccionCalle: string | undefined;
  direccionCiudad: string | undefined;
  direccionPais: string | undefined;

  constructor(
    private http: HttpClient
    ) { }

  getDatosUsuario(): Observable<DatosUsuarioActual> {
    const observable = this.http.get<DatosUsuarioActual>(this.baseUrl);
    return observable;
  }

}


