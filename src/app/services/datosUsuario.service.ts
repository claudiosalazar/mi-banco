import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosUsuario } from '../models/datos-usuario.model'; // Asegúrate de que la ruta sea correcta
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosUsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDatosUsuario(): Observable<DatosUsuario[]> {
    const idUser = localStorage.getItem('id_user') || '';
    const params = new HttpParams().set('id_user', idUser);
    return this.http.get<DatosUsuario[]>(`${this.apiUrl}/mibanco/datos_usuario`, { params });
  }

  guardarUsuarioEditado(id_datos_usuario: number, datosUsuarioEditado: any): Observable<any> {
    const idUser = localStorage.getItem('id_user') || '';
    const params = new HttpParams().set('id_user', idUser);
    console.table(datosUsuarioEditado);
    return this.http.put<any>(`${this.apiUrl}/mibanco/datos_usuario/${id_datos_usuario}`, datosUsuarioEditado, { params });
  }
}