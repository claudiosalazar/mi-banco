import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SegurosUsuario } from '../../shared/models/seguros-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class SegurosUsuarioService {
  private baseUrl = 'http://localhost:3000/backend/data/seguros-usuario.json';
  constructor(private http: HttpClient) { }

  getSegurosUsuario(): Observable<SegurosUsuario> {
    const observable = this.http.get<SegurosUsuario>(this.baseUrl);
    observable.subscribe(datos => console.log('Datos seguros recibidos:', datos));
    return observable;
  }

}
