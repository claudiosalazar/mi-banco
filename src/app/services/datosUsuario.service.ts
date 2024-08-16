import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DatosUsuario } from '../models/datos-usuario.model'; // Asegúrate de que la ruta sea correcta
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuario[]> {
    return this.http.get<DatosUsuario[]>(`${this.apiUrl}/mibanco/datos_usuario`).pipe();
  }

  guardarUsuarioEditado(id: number, datosUsuarioEditado: any): Observable<any> {
    console.table(datosUsuarioEditado);
    return this.http.put<any>(`${this.apiUrl}/mibanco/datos_usuario/${id}`, datosUsuarioEditado);
}

}