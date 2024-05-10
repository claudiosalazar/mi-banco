import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SegurosUsuario } from '../../shared/models/seguros-usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SegurosUsuarioService {

  //private baseUrl = 'http://localhost:3000/backend/data/seguros-usuario.json';
  private baseUrl = 'https://www.claudiosalazar.cl/mi-banco/angular/backend/data/seguros-usuario.json';

  seguros: any[] = [];

  constructor(
    private http: HttpClient
  ) { }

  getSegurosUsuario(): Observable<any> {
    return this.http.get<SegurosUsuario>(this.baseUrl).pipe(
      map(response => {
        return response.seguros;
      })
    );
  }

}
