import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DatosUsuario } from '../models/datos-usuario.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuario[]> {
    console.log('getDatosUsuario');
    return this.http.get<DatosUsuario[]>(`${this.URL}/mibanco/datos_usuario`).pipe(
      tap(datos => console.log('Datos del usuario:', datos))
    );
  }
}